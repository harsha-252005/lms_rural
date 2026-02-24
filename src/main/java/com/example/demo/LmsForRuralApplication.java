package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

@SpringBootApplication
public class LmsForRuralApplication {

	public static void main(String[] args) {
		createDatabaseIfNotExists();
		SpringApplication.run(LmsForRuralApplication.class, args);
	}

	private static void createDatabaseIfNotExists() {
		String url = "jdbc:postgresql://localhost:5432/postgres"; // Connect to default 'postgres' db
		String user = "postgres";
		String password = "postgres";

		try (Connection connection = DriverManager.getConnection(url, user, password);
				Statement statement = connection.createStatement()) {

			// Check if lms_rural database exists
			var resultSet = statement.executeQuery("SELECT 1 FROM pg_database WHERE datname = 'lms_rural'");

			if (!resultSet.next()) {
				System.out.println("Creating database: lms_rural");
				statement.executeUpdate("CREATE DATABASE lms_rural");
			} else {
				System.out.println("Database lms_rural already exists.");
			}

		} catch (Exception e) {
			System.err.println("Error creating database: " + e.getMessage());
			// We don't throw exception here as the DB might already exist or
			// the user might have different credentials, let Spring fail normally if so.
		}
	}
}
