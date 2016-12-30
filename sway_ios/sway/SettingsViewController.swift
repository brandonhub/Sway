//
//  SettingsViewController.swift
//  sway
//
//  Created by Brandon Meeks on 10/4/16.
//  Copyright © 2016 meeks. All rights reserved.
//

import UIKit
import Firebase
import FBSDKCoreKit
import FBSDKLoginKit

class SettingsViewController: UIViewController, FBSDKLoginButtonDelegate {
    
    var ref:FIRDatabaseReference!
   
    @IBOutlet weak var FacebookPlaceholder: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        ref =  FIRDatabase.database().reference()
    
        let loginButton = FBSDKLoginButton()
        loginButton.center = self.view.center
        loginButton.center.y = 50
        loginButton.delegate = self
        
        self.view.addSubview(loginButton)
    }
    
    // FACEBOOK AUTHENTICATION
    func loginButton(loginButton: FBSDKLoginButton!, didCompleteWithResult result: FBSDKLoginManagerLoginResult!, error: NSError?) {
        if let error = error {
            print(error.localizedDescription)
            return
        }
        
        let credential = FIRFacebookAuthProvider.credentialWithAccessToken(FBSDKAccessToken.currentAccessToken().tokenString)
        print("Retreived Credential!")

        FIRAuth.auth()?.signInWithCredential(credential, completion: { (user, error) in
            print("Logged in user: " + (user?.displayName)!)
            self.ref.child("users").child(user!.uid).setValue(["displayName": (user?.displayName)!])
        })
    }
    
    func loginButtonDidLogOut(loginButton: FBSDKLoginButton!) {
        print("User logged out!")
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }


}

