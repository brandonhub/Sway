//
//  Functions.swift
//  sway
//
//  Created by Brandon Meeks on 10/4/16.
//  Copyright © 2016 meeks. All rights reserved.
//

import Foundation
import Firebase
import FBSDKCoreKit
import FBSDKLoginKit

class Functions {

    static func getCurrentUser() -> FIRUser?{
        return FIRAuth.auth()?.currentUser
    }
    
    static func getImageFromUrl(imageUrl: String) -> UIImage{
        if let url  = NSURL(string: imageUrl),
            data = NSData(contentsOfURL: url)
        {
            return UIImage(data: data)!
        }
        return UIImage(named: "images/event_placeholder.png")!
    }
    
    static func getCurrentUnixTimestamp() -> Double {
        let timestamp = NSDate().timeIntervalSince1970
        return timestamp
    }
}