//
//  SessionListViewCell.swift
//  sway
//
//  Created by Brandon Meeks on 10/5/16.
//  Copyright © 2016 meeks. All rights reserved.
//

import UIKit

class SessionListViewCell: UITableViewCell {

    
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var ownerLabel: UILabel!
    @IBOutlet weak var locationLabel: UILabel!
    @IBOutlet weak var sessionThumbnailImageView: UIImageView!
    @IBOutlet weak var memberCount: UILabel!
    
    var id:String = ""
    
    override func layoutSubviews() {    //  "Constructor" for View Class
        super.layoutSubviews()
        self.sessionThumbnailImageView.layer.cornerRadius = self.sessionThumbnailImageView.frame.size.width / 2;
        self.sessionThumbnailImageView.clipsToBounds = true;    // Add circular frame to thumbnail
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
        
    }
    
    override func setSelected(selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        
        // Configure the view for the selected state
    }

}
