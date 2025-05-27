#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <ESP32Servo.h>

const char* ssid = "Trongnhat";
const char* password = "11111111";
const char* serverUrl = "http://172.20.10.6:6969/update"; // Đổi theo IP backend

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

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
}

void loop() {
  float d1 = readDistance(trigSlot1, echoSlot1);
  float d2 = readDistance(trigSlot2, echoSlot2);
  float de = readDistance(trigEntry,  echoEntry);
  float dx = readDistance(trigExit,   echoExit);

  Serial.printf("slot1: %.2f cm, slot2: %.2f cm, entry: %.2f cm, exit: %.2f cm\n", d1, d2, de, dx);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String payload = "{\"slot1\":" + String(d1) + ",\"slot2\":" + String(d2) +
                     ",\"entry\":" + String(de) + ",\"exit\":" + String(dx) + "}";

    int httpCode = http.POST(payload);

    if (httpCode == 200) {
      String response = http.getString();
      StaticJsonDocument<256> doc;
      DeserializationError error = deserializeJson(doc, response);
      if (!error) {
        if (doc["openEntryServo"] == true) {
          openServoNonBlocking(servoEntryCtrl, "ENTRY");
        }
        if (doc["openExitServo"] == true) {
          openServoNonBlocking(servoExitCtrl, "EXIT");
        }
      } else {
        Serial.println("[ERROR] Không phân tích được JSON phản hồi");
      }
    } else {
      Serial.printf("[HTTP] POST thất bại, mã lỗi: %d\n", httpCode);
    }

    http.end();
  }

  // Kiểm tra timeout để đóng servo nếu đã mở quá 5 giây
  handleServoTimeout(servoEntryCtrl, "ENTRY");
  handleServoTimeout(servoExitCtrl, "EXIT");

  delay(1000);
}
