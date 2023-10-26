USE tattoodb;

CREATE OR REPLACE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    service VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL
);

INSERT INTO appointments (name, email, service, date, time) VALUES
    ('John Doe', 'john.doe@example.com', 'Tattoo Design', '2023-11-01', '14:00:00');

INSERT INTO appointments (name, email, service, date, time) VALUES
    ('Jane Smith', 'jane.smith@example.com', 'Piercing', '2023-11-02', '10:30:00');

INSERT INTO appointments (name, email, service, date, time) VALUES
    ('Alice Johnson', 'alice.johnson@example.com', 'Tattoo Consultation', '2023-11-03', '15:45:00');

INSERT INTO appointments (name, email, service, date, time) VALUES
    ('Bob Brown', 'bob.brown@example.com', 'Tattoo Session', '2023-11-04', '11:00:00');

INSERT INTO appointments (name, email, service, date, time) VALUES
    ('Eva Williams', 'eva.williams@example.com', 'Body Piercing', '2023-11-05', '13:15:00');

INSERT INTO appointments (name, email, service, date, time) VALUES
    ('David Lee', 'david.lee@example.com', 'Tattoo Touch-up', '2023-11-06', '16:30:00');

INSERT INTO appointments (name, email, service, date, time) VALUES
    ('Sophia Hall', 'sophia.hall@example.com', 'Piercing', '2023-11-07', '10:00:00');

INSERT INTO appointments (name, email, service, date, time) VALUES
    ('Liam Miller', 'liam.miller@example.com', 'Tattoo Session', '2023-11-08', '14:45:00');

INSERT INTO appointments (name, email, service, date, time) VALUES
    ('Olivia Wilson', 'olivia.wilson@example.com', 'Tattoo Design', '2023-11-09', '12:30:00');

INSERT INTO appointments (name, email, service, date, time) VALUES
    ('Noah Davis', 'noah.davis@example.com', 'Body Piercing', '2023-11-10', '11:30:00');
