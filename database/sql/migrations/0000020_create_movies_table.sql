-- Create table for movies
CREATE TABLE IF NOT EXISTS `movies` (
    `id` INT AUTO_INCREMENT,
    `title` VARCHAR(128) NOT NULL,
    `description` VARCHAR(255),
    `release_date` DATE,
    `image_path` VARCHAR(255),
    `rating` INT CHECK (`rating` >= 0 AND `rating` <= 5),
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `category_id` INT,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `movies`
    ADD CONSTRAINT `fk_movies_category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;
