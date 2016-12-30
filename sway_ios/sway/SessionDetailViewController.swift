//
//  SessionDetailViewController.swift
//  sway
//
//  Created by Brandon Meeks on 10/5/16.
//  Copyright © 2016 meeks. All rights reserved.
//

import UIKit
import Firebase

class SessionDetailViewController: UITableViewController {
    
    var id:String!
    var sessionTitle:String!
    var ref: FIRDatabaseReference!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.title = sessionTitle
        self.ref = FIRDatabase.database().reference()
    }
    
    @IBAction func noButtonPress(sender: AnyObject) {
        let user = Functions.getCurrentUser()
        self.ref.child("sessions/" + id + "/members/" + (user?.uid)! + "/satisfaction").setValue(false)
    }
    
    @IBAction func yesButtonPress(sender: AnyObject) {
        let user = Functions.getCurrentUser()
        self.ref.child("sessions/" + id + "/members/" + (user?.uid)! + "/satisfaction").setValue(true)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

}
