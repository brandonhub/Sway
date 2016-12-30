//
//  SessionPreferencesViewController.swift
//  sway
//
//  Created by Brandon Meeks on 10/11/16.
//  Copyright © 2016 meeks. All rights reserved.
//

import UIKit
import Firebase

class SessionPreferencesViewController: UITableViewController {
    
    @IBOutlet weak var quiteButton: UIButton!
    @IBOutlet weak var louderButton: UIButton!
    @IBOutlet weak var justRightButton: UIButton!
    
    var ref: FIRDatabaseReference!
    var id:String = ""
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.ref = FIRDatabase.database().reference()
        
        // initialize buttons rounding
        quiteButton.layer.cornerRadius = 0.5 * quiteButton.bounds.size.width
        quiteButton.clipsToBounds = true
        
        louderButton.layer.cornerRadius = 0.5 * quiteButton.bounds.size.width
        louderButton.clipsToBounds = true
        
        justRightButton.layer.cornerRadius = 0.5 * quiteButton.bounds.size.width
        justRightButton.clipsToBounds = true
        
        // fetch current user preference for this session
    }
    
    @IBAction func energyLevelChanged(sender: UISlider) {
        let user = Functions.getCurrentUser()
        ref.child("sessions/" + id + "/members/" + (user?.uid)! + "/energy").setValue(sender.value)
    }
    
    @IBAction func satisfactionChanged(sender: UISegmentedControl) {
        let user = Functions.getCurrentUser()

        if sender.selectedSegmentIndex == 0 {
            ref.child("sessions/" + id + "/members/" + (user?.uid)! + "/satisfaction").setValue(true)
        }
        else{
            ref.child("sessions/" + id + "/members/" + (user?.uid)! + "/satisfaction").setValue(false)
        }
        
    }

    @IBAction func quiterButtonPressed(sender: UIButton) {
        let user = Functions.getCurrentUser()
        ref.child("sessions/" + id + "/members/" + (user?.uid)! + "/volume").setValue(-1)
    }
    
    @IBAction func justRightButtonPressed(sender: UIButton) {
        let user = Functions.getCurrentUser()
        ref.child("sessions/" + id + "/members/" + (user?.uid)! + "/volume").setValue(0)
    }
    
    @IBAction func louderButtonPressed(sender: UIButton) {
        let user = Functions.getCurrentUser()
        ref.child("sessions/" + id + "/members/" + (user?.uid)! + "/volume").setValue(1)
    }
    
}
