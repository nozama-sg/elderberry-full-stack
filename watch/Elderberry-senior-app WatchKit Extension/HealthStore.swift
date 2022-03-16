//
//  HealthStore.swift
//  Elderberry-senior-app WatchKit Extension
//
//  Created by glendatxn on 2/3/22.
//

import Foundation
import HealthKit

class HealthStore {
    var healthStore : HKHealthStore?
    
    let stepType = HKQuantityType.quantityType(forIdentifier: HKQuantityTypeIdentifier.stepCount)!
    
    let heartRateType = HKQuantityType.quantityType(forIdentifier: HKQuantityTypeIdentifier.heartRate)!

    let walkingAsymmetryType = HKQuantityType.quantityType(forIdentifier: HKQuantityTypeIdentifier.walkingAsymmetryPercentage)!
    
    let fallCountType = HKQuantityType.quantityType(forIdentifier: HKQuantityTypeIdentifier.numberOfTimesFallen)!
    
    let restingHeartRateType = HKQuantityType.quantityType(forIdentifier: HKQuantityTypeIdentifier.restingHeartRate)!
    
    let sleepDataType = HKQuantityType.categoryType(forIdentifier: HKCategoryTypeIdentifier.sleepAnalysis)!
    
    let workoutType = HKQuantityType.workoutType()
    
    init() {
        if HKHealthStore.isHealthDataAvailable() {
            healthStore = HKHealthStore()
        }
     }
    
    func getTodaySteps(completion: @escaping (Double) -> Void) {
        let now = Date()
        let startOfDay = Calendar.current.startOfDay(for: now)
        let predicate = HKQuery.predicateForSamples(
            withStart: startOfDay,
            end: now,
            options: .strictStartDate
        )

        let query = HKStatisticsQuery(
            quantityType: stepType,
            quantitySamplePredicate: predicate,
            options: .cumulativeSum
        ) { _, result, err in
            guard let result = result, let sum = result.sumQuantity() else {
                print(err)
                print("GET STEPS OPERATION FAILED")
                completion(0.0)
                return
            }
            completion(sum.doubleValue(for: HKUnit.count()))
        }
        
        if let healthStore=healthStore {
            healthStore.execute(query)
        }
    }
    
    func getFallCount(completion: @escaping (Double) -> Void) {
        let now = Date()
        let startOfDay = Calendar.current.startOfDay(for: now)
        let predicate = HKQuery.predicateForSamples(
            withStart: startOfDay,
            end: now,
            options: .strictStartDate
        )

        let query = HKStatisticsQuery(
            quantityType: fallCountType,
            quantitySamplePredicate: predicate,
            options: .cumulativeSum
        ) { _, result, err in
            guard let result = result, let sum = result.sumQuantity() else {
                print(err)
                print("FALL COUNT OPERATION FAILED")
                completion(0.0)
                return
            }
            completion(sum.doubleValue(for: HKUnit.count()))
        }
        
        if let healthStore=healthStore {
            healthStore.execute(query)
        }
    }
    
    func getTodaySleep(completion: @escaping (Int) -> Void) {
        let startDate = Calendar.current.date(byAdding: .day, value:-1, to:Date())
        let endDate = Date()
        
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: .strictStartDate)

        // I had a sortDescriptor to get the recent data first
        let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)

        // we create our query with a block completion to execute
        let query = HKSampleQuery(sampleType: sleepDataType, predicate: predicate, limit: 1, sortDescriptors: [sortDescriptor]) { (query, result, error) in
            if error != nil {
                print("ERROR \(error)")
                return
            }
            
            if let result = result {
               for item in result {
                    print(item)
                    if let devSample = item as? HKDevice {
                        print("devsample \(devSample)")
                    }
                
                    if let sample = item as? HKCategorySample {
                        
                        let sleepTimeForOneDay = Int(sample.endDate.timeIntervalSince(sample.startDate))
                        
                        completion(sleepTimeForOneDay)
                        print("one day sleep \(sleepTimeForOneDay)")
                    }
                }
            }
        }
        
        if let healthStore=healthStore {
            healthStore.execute(query)
        }
    }
    
    func getHeartrate(completion: @escaping (Double) -> Void) {
        let sort = [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)]
        
        let query = HKSampleQuery(sampleType: heartRateType, predicate: nil, limit: 1, sortDescriptors: sort) { _, samples, err in
            guard let samples=samples else {
                print("ERROR")
                print(err)
                return
            }
            
            let sample = samples[0] as! HKQuantitySample
            
            completion(sample.quantity.doubleValue(for: HKUnit.count().unitDivided(by:HKUnit.minute())
            ))
        }
        
        
        if let healthStore=healthStore {
            healthStore.execute(query)
        }
    }
    
    func getWalkingAsymmetry(completion: @escaping (Double) -> Void) {
        let sort = [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)]
        
        let query = HKSampleQuery(sampleType: walkingAsymmetryType, predicate: nil, limit: 1, sortDescriptors: sort) { _, samples, err in
            guard let samples=samples else {
                print("ERROR")
                print(err)
                return
            }
            
            let sample = samples[0] as! HKQuantitySample
            
            completion(sample.quantity.doubleValue(for: HKUnit.percent()))
        }
        
        
        if let healthStore=healthStore {
            healthStore.execute(query)
        }
    }
    
    func requestAuthorization(completion: @escaping(Bool) -> Void) {
        guard let healthStore = self.healthStore else {return completion(false)}
        
        healthStore.requestAuthorization(
            toShare: [workoutType] ,
            read: [stepType, heartRateType, walkingAsymmetryType, fallCountType, restingHeartRateType, sleepDataType])
            {(success, error) in completion(success)}
        
    }
}
