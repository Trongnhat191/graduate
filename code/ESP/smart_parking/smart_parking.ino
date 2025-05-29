#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <ESP32Servo.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2); // Địa chỉ I2C thường là 0x27 hoặc 0x3F
String lastPlate = "";
String ticketTypeIn = "";

const char* ssid = "TP-Link_825C";
const char* password = "68449681";
const char* ws_host = "192.168.0.112";
const uint16_t ws_port = 6969;
const char* ws_path = "/";

WebSocketsClient webSocket;
bool wsConnected = false;

// Cảm biến vị trí đỗ
int trigSlot1 = 18, echoSlot1 = 5;
int trigSlot2 = 19, echoSlot2 = 23;

// Cảm biến cổng ra/vào
int trigEntry = 27, echoEntry = 14;
int trigExit  = 12, echoExit  = 13;

// Servo cổng
struct ServoControl {
  Servo servo;
  int pin;
  bool isOpen = false;
  unsigned long openTime = 0;
};

ServoControl servoEntryCtrl = {Servo(), 25};
ServoControl servoExitCtrl  = {Servo(), 26};

// Đọc khoảng cách từ cảm biến HC-SR04
float readDistance(int trig, int echo) {
  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);
  long duration = pulseIn(echo, HIGH, 30000); // timeout 30ms
  return duration > 0 ? (duration * 0.034 / 2.0) : 999;
}

// Mở servo (non-blocking)
void openServoNonBlocking(ServoControl &s, const char* name) {
  if (!s.isOpen) {
    Serial.printf("[SERVO] Mở %s...\n", name);
    s.servo.write(90);
    s.openTime = millis();
    s.isOpen = true;
  }
}

// Tự đóng servo sau 5 giây
void handleServoTimeout(ServoControl &s, const char* name) {
  if (s.isOpen && millis() - s.openTime >= 5000) {
    s.servo.write(0);
    s.isOpen = false;
    Serial.printf("[SERVO] Đóng %s\n", name);
  }
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("[WS] Ngắt kết nối!");
      wsConnected = false;
      break;
    case WStype_CONNECTED:
      Serial.println("[WS] Đã kết nối!");
      wsConnected = true;
      break;
    case WStype_TEXT:{
      Serial.printf("[WS] Nhận: %s\n", payload);
      StaticJsonDocument<256> doc;
      DeserializationError error = deserializeJson(doc, payload, length);
      if (!error) {
        if (doc["openEntryServo"] == true) {
          openServoNonBlocking(servoEntryCtrl, "ENTRY");
          if (doc.containsKey("plate")) {
            lastPlate = doc["plate"].as<String>();
            lcd.clear();
            lcd.setCursor(0, 0);
            lcd.print("Plate: ");
            lcd.print(lastPlate);
          }
        }
        else  if (doc["openEntryServo"] == false) {
          if (doc.containsKey("plate")) {
            lcd.clear();
            lcd.setCursor(0, 0);
            lcd.print("Plate: ");
            lcd.print(doc["plate"].as<String>());
          }
        }
        if (doc["ticketTypeIn"] == "month" || doc["ticketTypeIn"] == "day") {
          lcd.setCursor(0, 1);
          lcd.print("Ticket: ");

          ticketTypeIn = doc["ticketTypeIn"].as<String>();
          lcd.print(ticketTypeIn);
          
        }
        if (doc["openExitServo"] == true) openServoNonBlocking(servoExitCtrl, "EXIT");
      }
      break;}
    default:
      break;
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  pinMode(trigSlot1, OUTPUT); pinMode(echoSlot1, INPUT);
  pinMode(trigSlot2, OUTPUT); pinMode(echoSlot2, INPUT);
  pinMode(trigEntry,  OUTPUT); pinMode(echoEntry, INPUT);
  pinMode(trigExit,   OUTPUT); pinMode(echoExit, INPUT);

  // Gắn servo
  servoEntryCtrl.servo.attach(servoEntryCtrl.pin);
  servoExitCtrl.servo.attach(servoExitCtrl.pin);
  servoEntryCtrl.servo.write(0);
  servoExitCtrl.servo.write(0);

  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Smart Parking!");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");

  webSocket.begin(ws_host, ws_port, ws_path);
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);
}

void loop() {
  webSocket.loop();

  static unsigned long lastSend = 0;
  if (millis() - lastSend > 1000 && wsConnected) {
    lastSend = millis();

    float d1 = readDistance(trigSlot1, echoSlot1);
    float d2 = readDistance(trigSlot2, echoSlot2);
    float de = readDistance(trigEntry,  echoEntry);
    float dx = readDistance(trigExit,   echoExit);

    StaticJsonDocument<200> doc;
    doc["slot1"] = d1;
    doc["slot2"] = d2;
    doc["entry"] = de;
    doc["exit"]  = dx;

    String payload;
    serializeJson(doc, payload);
    webSocket.sendTXT(payload);

    Serial.print("[WS] Gửi: ");
    Serial.println(payload);
  }

  handleServoTimeout(servoEntryCtrl, "ENTRY");
  handleServoTimeout(servoExitCtrl, "EXIT");

  delay(10);
}
