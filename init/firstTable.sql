CREATE TABLE IF NOT EXISTS `user` (
    user_id INT AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    profile LONGBLOB,
    provider VARCHAR(255) DEFAULT 'Local',
    sns_id VARCHAR(255),
    user_name VARCHAR(255) NOT NULL UNIQUE,

    PRIMARY KEY (user_id,user_name)
);


CREATE TABLE IF NOT EXISTS `roomlist`(
    room_id INT AUTO_INCREMENT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS `chat`(
    user_id INT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    room_id INT,
    message VARCHAR(255),
    #chat_id INT AUTO_INCREMENT,
    #FOREIGN KEY (user_name) REFERENCES user (user_name),
    FOREIGN KEY (user_id) REFERENCES user (user_id),
    FOREIGN KEY (room_id) REFERENCES roomlist (room_id),
    PRIMARY KEY (user_id,room_id)
);