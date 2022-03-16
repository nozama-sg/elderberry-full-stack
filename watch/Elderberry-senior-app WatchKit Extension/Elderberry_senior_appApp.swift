//
//  Elderberry_senior_appApp.swift
//  Elderberry-senior-app WatchKit Extension
//
//  Created by glendatxn on 2/3/22.
//

import SwiftUI

@main
struct Elderberry_senior_appApp: App {
    @SceneBuilder var body: some Scene {
        WindowGroup {
            NavigationView {
                ContentView()
            }
        }

        WKNotificationScene(controller: NotificationController.self, category: "myCategory")
    }
}
