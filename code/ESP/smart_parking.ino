#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Servo.h>

// WiFi info
const char* ssid = "TP-Link_825C";
const char* password = "68449681";
const char* serverUrl = "http://192.168.0.112:6969/update"; // Địa chỉ server NodeJS

// GPIO cảm biến
int trigSlot1 = 18, echoSlot1 = 5;
int trigSlot2 = 21, echoSlot2 = 22;
int trigEntry = 27, echoEntry = 14;
int trigExit  = 12, echoExit  = 13;

// GPIO servo
const int servoEntryPin = 32;
const int servoExitPin = 33;

Servo servoEntry;
Servo servoExit;

float readDistance(int trig, int echo) {
  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);
  long duration = pulseIn(echo, HIGH, 30000); // timeout 30ms
  return duration > 0 ? (duration * 0.034 / 2) : 999;
}

void openServo(Servo& servo, const char* name) {
  Serial.printf("[SERVO] Mở %s...\n", name);
  servo.write(90); // góc mở
  delay(5000);     // giữ mở 5 giây
  servo.write(0);  // đóng lại
  Serial.printf("[SERVO] Đóng %s\n", name);
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  pinMode(trigSlot1, OUTPUT); pinMode(echoSlot1, INPUT);
  pinMode(trigSlot2, OUTPUT); pinMode(echoSlot2, INPUT);
  pinMode(trigEntry,  OUTPUT); pinMode(echoEntry, INPUT);
  pinMode(trigExit,   OUTPUT); pinMode(echoExit, INPUT);

  servoEntry.attach(servoEntryPin);
  servoExit.attach(servoExitPin);
  servoEntry.write(0);
  servoExit.write(0);

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
    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("[SERVER] Response: " + response);

      StaticJsonDocument<200> doc;
      DeserializationError error = deserializeJson(doc, response);
      if (!error) {
        if (doc["openEntryServo"] == true) {
          openServo(servoEntry, "ENTRY");
        }
        if (doc["openExitServo"] == true) {
          openServo(servoExit, "EXIT");
        }
      } else {
        Serial.println("[ERROR] Phân tích JSON lỗi!");
      }
    } else {
      Serial.printf("[ERROR] Gửi POST thất bại, mã: %d\n", httpResponseCode);
    }

    http.end();
  }

  delay(1000);
}
