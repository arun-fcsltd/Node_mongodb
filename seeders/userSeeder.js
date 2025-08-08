const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const faker = require("faker");
const User = require("../models/User");

// Array of realistic Indian names
const indianNames = [
  "Aarav Sharma",
  "Advait Patel",
  "Aanya Gupta",
  "Arjun Singh",
  "Diya Reddy",
  "Ishaan Kumar",
  "Kavya Joshi",
  "Reyansh Malhotra",
  "Ananya Choudhury",
  "Vivaan Nair",
  "Aditi Iyer",
  "Dhruv Agarwal",
  "Ishita Banerjee",
  "Krish Menon",
  "Myra Kapoor",
  "Rudra Saxena",
  "Saanvi Deshpande",
  "Vihaan Khanna",
  "Aarohi Raman",
  "Atharv Trivedi",
  "Bhavya Mehra",
  "Divit Chawla",
  "Eshaan Bajaj",
  "Hridaan Chopra",
  "Kiara Venkatesh",
  "Navya Sinha",
  "Pranav Mishra",
  "Reeva Goswami",
  "Shaurya Dutta",
  "Tanya Bhatt",
];

// Function to generate random phone number
const generatePhoneNumber = () => {
  return "9" + Math.floor(100000000 + Math.random() * 900000000);
};

// Generate users with specific roles
const generateUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany();
    console.log("Cleared existing users");

    // Generate 2 admins
    for (let i = 0; i < 2; i++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      await User.create({
        name: `${firstName} ${lastName}`,
        email: `admin${i + 1}@scrapmart.com`,
        phone: generatePhoneNumber(),
        password: "password",//becasue in model before save validators will bcrypt it
        role: "admin",
      });
    }

    // Generate 20 workers
    for (let i = 0; i < 20; i++) {
      const name = indianNames[Math.floor(Math.random() * indianNames.length)];
      await User.create({
        name: name,
        email: `worker${i + 1}@scrapmart.com`,
        phone: generatePhoneNumber(),
        password: "password",//becasue in model before save validators will bcrypt it
        role: "worker",
      });
    }

    // Generate 2 store-admins
    for (let i = 0; i < 2; i++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      await User.create({
        name: `${firstName} ${lastName}`,
        email: `storeadmin${i + 1}@scrapmart.com`,
        phone: generatePhoneNumber(),
        password: "password",//becasue in model before save validators will bcrypt it
        role: "store-admin",
      });
    }

    // Generate 2 scrap-admins
    for (let i = 0; i < 2; i++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      await User.create({
        name: `${firstName} ${lastName}`,
        email: `scrapadmin${i + 1}@scrapmart.com`,
        phone: generatePhoneNumber(),
        password: "password",//becasue in model before save validators will bcrypt it
        role: "scrap-admin",
      });
    }

    // Generate 20 vendors
    for (let i = 0; i < 20; i++) {
      const name = indianNames[Math.floor(Math.random() * indianNames.length)];
      await User.create({
        name: name,
        email: `vendor${i + 1}@scrapmart.com`,
        phone: generatePhoneNumber(),
        password: "password",//becasue in model before save validators will bcrypt it
        role: "vendor",
      });
    }

    console.log("Seed data created successfully");
   
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

module.exports = generateUsers;
