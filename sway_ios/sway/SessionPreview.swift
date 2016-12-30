//
//  Session.swift
//  sway
//
//  Created by Brandon Meeks on 10/5/16.
//  Copyright © 2016 meeks. All rights reserved.
//

import Foundation

class SessionPreview {
    
    var owner:String
    var title:String
    var id:String
    var location:String
    var imageUrl:String
    var memberCount:Int

    init(id: String, title:String, owner:String, location:String, imageUrl:String, memberCount:Int ) {
        self.id = id
        self.title = title
        self.owner = owner
        self.location = location
        self.imageUrl = imageUrl
        self.memberCount = memberCount
    }

}