-- Create table for category_movie
CREATE TABLE IF NOT EXISTS `category_movie` (
    `category_id` INT,
    `movie_id` INT,
    PRIMARY KEY (`category_id`, `movie_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `movies`
    ADD CONSTRAINT `fk_category_movie_category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
    ADD CONSTRAINT `fk_category_movie_movie_id` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE;