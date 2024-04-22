-- Create table for categories
CREATE TABLE IF NOT EXISTS `categories` (
    `id` INT AUTO_INCREMENT,
    `label` VARCHAR(128) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_categories_label` (`label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;