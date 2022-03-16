//
//  ContentView.swift
//  Elderberry-senior-app WatchKit Extension
//
//  Created by glendatxn on 2/3/22.
//

import SwiftUI
import HealthKit

struct ContentView: View {
    
    private var healthStore: HealthStore?
    let secondTimer = Timer.publish(every: 10, on: .main, in: .common).autoconnect()

    
    init() {
        healthStore = HealthStore()
    }
    
    func postData(url: String, data: [String: Any]) {
        let url = URL(string: url)!
        var request = URLRequest(url: url)
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpMethod = "POST"
        
        var bodyStr = "{"
        for (key, value) in data {
            bodyStr += "\"\(key)\":\"\(value)\","
        }
        
        bodyStr = String(bodyStr.dropLast(1)) + "}"
        
        print("bodystr \(bodyStr)")
        
        request.httpBody = bodyStr.data(using: String.Encoding.utf8)
        
        let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
                
                // Check for Error
                if let error = error {
                    print("Error took place \(error)")
                    return
                }
         
                // Convert HTTP Response Data to a String
                if let data = data, let dataString = String(data: data, encoding: .utf8) {
                    print("Response data string:\n \(dataString)")
                }
        }
        task.resume()
        
    }
    
  
    var body: some View {
        Text("Hello, World!")
            .padding()

            .onReceive(secondTimer) { time in
                print("timer received")
                if let healthStore = healthStore {
                    healthStore.requestAuthorization {success in
                        if success {
                            
                            print("Health store success, gathering data")
                            
                            // Every 1s
                            healthStore.getTodaySteps() {data in
                                print("todays steps")
                                print("STEPS: \(data)")
                                
                                let body = ["value": "\(data)", "userId": "227"]
                                postData(url: "http://119.13.104.214:80/stepCount/postData", data: body)
                            }
                            
                            
                            healthStore.getHeartrate(){data in
                                print("heart rate: \(data)")
                                let body = ["value": "\(data)", "userId": "227"]
                                
                                postData(url: "http://119.13.104.214:80/heartRate/postData", data: body)
                            }
                            
                            healthStore.getFallCount() { data in
                                print("fall count: \(data)")
                                
                            }
                            
                        }
                    }
                }
            }
        
            .onAppear() {
                print("appear")
                
                if let healthStore = healthStore {
                    healthStore.requestAuthorization {success in
                        if success {
                            //Start of the day
                            healthStore.getWalkingAsymmetry() {data in
                                print("walking asymmetry: \(data)")
                                let body = ["value": "\(data)", "userId": "227"]
                                
                                postData(url: "http://119.13.104.214:80/stepAsymmetry/postData", data: body)
                            }
                            
                            healthStore.getTodaySleep() { data in
                                print("Sleep seconds: \(data)")
                                let body = ["value": "\(data)", "userId": "227"]
                                 
                                postData(url: "http://119.13.104.214:80/sleepSeconds/postData", data: body)
                            }
                        }
                    }
                }
                
            }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
