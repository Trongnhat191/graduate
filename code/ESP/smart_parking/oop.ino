#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <ESP32Servo.h>
#include <LiquidCrystal_I2C.h>

class DistanceSensor {
  int trig, echo;
public:
  DistanceSensor(int t, int e) : trig(t), echo(e) {
    pinMode(trig, OUTPUT);
    pinMode(echo, INPUT);
  }

  float read() {
    digitalWrite(trig, LOW);
    delayMicroseconds(2);
    digitalWrite(trig, HIGH);
    delayMicroseconds(10);
    digitalWrite(trig, LOW);
    long duration = pulseIn(echo, HIGH, 30000);
    return duration > 0 ? (duration * 0.034 / 2.0) : 999;
  }
};

class ServoGate {
  Servo servo;
  int pin;
  bool isOpen = false;
  unsigned long openTime = 0;
  String name;
public:
  ServoGate(int p, String n) : pin(p), name(n) {}

  void attach() {
    servo.attach(pin);
    servo.write(90);
  }

  void open() {
    if (!isOpen) {
      servo.write(0);
      openTime = millis();
      isOpen = true;
      Serial.printf("[SERVO] Mở %s...\n", name.c_str());
    }
  }

  void handleTimeout() {
    if (isOpen && millis() - openTime >= 5000) {
      servo.write(90);
      isOpen = false;
      Serial.printf("[SERVO] Đóng %s\n", name.c_str());
    }
  }
};

class DisplayManager {
  LiquidCrystal_I2C lcd;
public:
  DisplayManager() : lcd(0x27, 16, 2) {}

  void begin() {
    lcd.init();
    lcd.backlight();
    lcd.setCursor(0, 0);
    lcd.print("Smart Parking!");
  }

  void showPlate(const String& plate) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Plate: ");
    lcd.print(plate);
  }

  void showTicket(const String& ticket) {
    lcd.setCursor(0, 1);
    lcd.print("Ticket: ");
    lcd.print(ticket);
  }
};

class SmartParkingSystem {
  const char* ssid = "TP-Link_825C";
  const char* password = "68449681";
  const char* ws_host = "192.168.0.112";
  const uint16_t ws_port = 6969;
  const char* ws_path = "/";

  DistanceSensor slotSensors[5] = {
    {18, 5}, {19, 23}, {4, 32}, {2, 33}, {15, 34}
  };
  DistanceSensor entrySensor = {27, 14};
  DistanceSensor exitSensor  = {12, 13};

  ServoGate entryGate = {25, "ENTRY"};
  ServoGate exitGate  = {26, "EXIT"};

  DisplayManager display;

  WebSocketsClient webSocket;
  bool wsConnected = false;
  String lastPlate = "", ticketTypeIn = "";

public:
  void setup() {
    Serial.begin(115200);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
    Serial.println("\nWiFi connected");

    display.begin();

    entryGate.attach();
    exitGate.attach();

    webSocket.begin(ws_host, ws_port, ws_path);
    webSocket.onEvent([this](WStype_t t, uint8_t* p, size_t l) {
      this->onWebSocketEvent(t, p, l);
    });
    webSocket.setReconnectInterval(5000);
  }

  void loop() {
    webSocket.loop();
    static unsigned long lastSend = 0;
    if (millis() - lastSend > 1000 && wsConnected) {
      lastSend = millis();
      sendSensorData();
    }
    entryGate.handleTimeout();
    exitGate.handleTimeout();
    delay(10);
  }

private:
  void onWebSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
    switch(type) {
      case WStype_DISCONNECTED:
        Serial.println("[WS] Ngắt kết nối!");
        wsConnected = false;
        break;
      case WStype_CONNECTED:
        Serial.println("[WS] Đã kết nối!");
        wsConnected = true;
        break;
      case WStype_TEXT: {
        Serial.printf("[WS] Nhận: %s\n", payload);
        StaticJsonDocument<256> doc;
        if (deserializeJson(doc, payload, length)) return;

        if (doc["openEntryServo"] == true) {
          entryGate.open();
          if (doc.containsKey("plate")) {
            lastPlate = doc["plate"].as<String>();
            display.showPlate(lastPlate);
          }
        } else if (doc["openEntryServo"] == false && doc.containsKey("plate")) {
          display.showPlate(doc["plate"].as<String>());
        }

        if (doc["ticketTypeIn"] == "month" || doc["ticketTypeIn"] == "day") {
          ticketTypeIn = doc["ticketTypeIn"].as<String>();
          display.showTicket(ticketTypeIn);
        }

        if (doc["openExitServo"] == true) {
          exitGate.open();
        }
        break;
      }
      default:
        break;
    }
  }

  void sendSensorData() {
    StaticJsonDocument<200> doc;
    for (int i = 0; i < 5; ++i) {
      doc["slot" + String(i + 1)] = slotSensors[i].read();
    }
    doc["entry"] = entrySensor.read();
    doc["exit"]  = exitSensor.read();

    String payload;
    serializeJson(doc, payload);
    webSocket.sendTXT(payload);
    Serial.print("[WS] Gửi: ");
    Serial.println(payload);
  }
};

SmartParkingSystem parking;

void setup() {
  parking.setup();
}

void loop() {
  parking.loop();
}
