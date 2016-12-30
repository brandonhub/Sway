//
//  SessionListViewController.swift
//  sway
//
//  Created by Brandon Meeks on 10/4/16.
//  Copyright © 2016 meeks. All rights reserved.
//

import UIKit
import Firebase
import SwiftSpinner

class SessionListViewController: UITableViewController {
    
    var sessions = [SessionPreview]()
    var ref: FIRDatabaseReference!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        SwiftSpinner.show("Loading")
        self.ref = FIRDatabase.database().reference()
        
        // INITIALIZE DATA LISTENERS
        // Listens for new events added
        ref.child("sessions").observeSingleEventOfType(.Value, withBlock: { (snapshot) in
            for child in snapshot.children {
                let childSnapshot = snapshot.childSnapshotForPath(child.key)
                let title = childSnapshot.value!["title"] as! String
                let owner = childSnapshot.value!["owner"] as! String
                let location = childSnapshot.value!["location"] as! String
                let imageUrl = childSnapshot.value!["imageUrl"] as! String
                let members = childSnapshot.value!["members"] as? NSDictionary
                var memberCount = 0
                if members != nil {
                    memberCount = Array(members!.allKeys).count
                }
                
                let sessionPreview = SessionPreview(id: child.key, title: title, owner: owner, location: location, imageUrl: imageUrl, memberCount: memberCount)
                self.sessions.append(sessionPreview)
            }
            self.tableView.reloadData()
            SwiftSpinner.hide()
        }) { (error) in
            print(error.localizedDescription)
        }
    }
    
    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return sessions.count
    }
    
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let session = sessions[indexPath.row]
        let cellIdentifier = "sessionCell"
        let cell = tableView.dequeueReusableCellWithIdentifier(cellIdentifier, forIndexPath: indexPath) as! SessionListViewCell
        
        cell.ownerLabel.text = session.owner
        cell.locationLabel.text = session.location
        cell.id = session.id
        cell.titleLabel.text = session.title
        cell.memberCount.text = String(session.memberCount) + " members"
        cell.sessionThumbnailImageView?.image  = Functions.getImageFromUrl(session.imageUrl)
        
        return cell
    }
    
    
    func addCurrentUserToSession(session: SessionPreview){
        let user = Functions.getCurrentUser()
        print(user)
        ref.child("users").child((user?.uid)!).observeSingleEventOfType(.Value, withBlock: { (snapshot)   in
            
            let value = snapshot.value as? NSDictionary
            let currentSessionId = value?["currentSession"] as? String
            
            if currentSessionId != nil{
                self.ref.child("sessions/" + currentSessionId! + "/members").child(user!.uid).setValue(nil)  // Remove user from existing session
            }
            
            self.ref.child("users/" + user!.uid + "/currentSession").setValue(session.id) // Update user object's session membership
            self.ref.child("sessions/" + session.id + "/members/" + user!.uid).setValue(     // Update session object's members list
                [
                    "displayName": (user?.displayName)!,
                    "joinDate": Functions.getCurrentUnixTimestamp()
                ]
            )
        }) { (error) in
            print(error.localizedDescription)
        }
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        print("lol")
        if  segue.identifier == "sessionDetailSegue" {
        
            let destination = segue.destinationViewController as! SessionPreferencesViewController
            let sessionIndex = tableView.indexPathForSelectedRow?.row
            
            print(destination)
        
            // Pass in necessary information for intial view presentation
            let session = sessions[sessionIndex!]
            destination.title = session.title
            destination.id = session.id
            print("hi")
            
            // Add user to detination session
            addCurrentUserToSession(session)
            
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    

}
