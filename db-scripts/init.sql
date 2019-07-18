CREATE TABLE IF NOT EXISTS Authors (
    author_id INT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(1023),
    PRIMARY KEY (author_id)
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Images (
    image_id INT UNSIGNED AUTO_INCREMENT,
    path VARCHAR(1023),
    PRIMARY KEY (image_id)
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS Books (
    book_id INT UNSIGNED AUTO_INCREMENT,
    title VARCHAR(1023) NOT NULL,
    date DATE,
    author_id INT UNSIGNED NOT NULL,
    description TEXT,
    image_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (book_id),
    CONSTRAINT FK_BookAuthor FOREIGN KEY (author_id) REFERENCES Authors(author_id),
    CONSTRAINT FK_BookImage FOREIGN KEY (image_id) REFERENCES Images(image_id),
    INDEX date_index(date)
)  ENGINE=INNODB;
