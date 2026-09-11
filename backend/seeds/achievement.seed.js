import mongoose from "mongoose";
import Badge from "../models/badge.model.js";
import Category from "../models/category.model.js";


export const seedAchievements = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return;
    }

   
    let aiCategory = await Category.findOne({
      name: { $regex: /^AI|Artificial Intelligence/i },
    });

    if (!aiCategory) {
      
      const adminUser = await mongoose.model("User").findOne({ role: "admin" });
      if (adminUser) {
        aiCategory = await Category.create({
          name: "Artificial Intelligence",
          description: "Courses related to Artificial Intelligence and Machine Learning",
          createdBy: adminUser._id,
        });
      }
    }

    const initialBadges = [
      // Learner Badges
      {
        name: "AI Explorer",
        description: "Complete 1 AI course",
        image: "https://cdn-icons-png.flaticon.com/512/2593/2593635.png",
        roles: ["learner"],
        requirementType: "category_courses_completed",
        requirementValue: 1,
        category: aiCategory ? aiCategory._id : null,
        rarity: "common",
      },
      {
        name: "AI Specialist",
        description: "Complete 3 AI courses",
        image: "https://cdn-icons-png.flaticon.com/512/2593/2593644.png",
        roles: ["learner"],
        requirementType: "category_courses_completed",
        requirementValue: 3,
        category: aiCategory ? aiCategory._id : null,
        rarity: "rare",
      },
      {
        name: "Knowledge Seeker",
        description: "Complete 3 courses",
        image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        roles: ["learner"],
        requirementType: "courses_completed",
        requirementValue: 3,
        category: null,
        rarity: "common",
      },
      {
        name: "Learning Master",
        description: "Complete 5 courses",
        image: "https://cdn-icons-png.flaticon.com/512/1903/1903162.png",
        roles: ["learner"],
        requirementType: "courses_completed",
        requirementValue: 5,
        category: null,
        rarity: "rare",
      },

      // Creator Badges
      {
        name: "Rising Creator",
        description: "Create 5 courses",
        image: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
        roles: ["creator"],
        requirementType: "courses_created",
        requirementValue: 5,
        category: null,
        rarity: "rare",
      },
      {
        name: "Resource Builder",
        description: "Create 5 resources",
        image: "https://cdn-icons-png.flaticon.com/512/3588/3588658.png",
        roles: ["creator"],
        requirementType: "resources_created",
        requirementValue: 5,
        category: null,
        rarity: "common",
      },
      {
        name: "Premium Creator",
        description: "Earnings >= ₹50,000",
        image: "https://cdn-icons-png.flaticon.com/512/3135/3135789.png",
        roles: ["creator"],
        requirementType: "earnings",
        requirementValue: 50000,
        category: null,
        rarity: "epic",
      },

      // Expert Badges
      {
        name: "Mentor Pro",
        description: "Complete 5 mentorship sessions",
        image: "https://cdn-icons-png.flaticon.com/512/4762/4762311.png",
        roles: ["expert"],
        requirementType: "sessions_completed",
        requirementValue: 5,
        category: null,
        rarity: "rare",
      },
      {
        name: "Premium Expert",
        description: "Earnings >= ₹50,000",
        image: "https://cdn-icons-png.flaticon.com/512/2583/2583344.png",
        roles: ["expert"],
        requirementType: "earnings",
        requirementValue: 50000,
        category: null,
        rarity: "epic",
      },
    ];

    for (const badgeData of initialBadges) {
      const existingBadge = await Badge.findOne({ name: badgeData.name });

      if (!existingBadge) {
        await Badge.create({
          ...badgeData,
          users: [],
          isActive: true,
        });
        console.log(`[Seed] Created badge: ${badgeData.name}`);
      } else {
        // Safely update config definitions without overwriting existing unlocked users
        existingBadge.description = badgeData.description;
        existingBadge.image = badgeData.image;
        existingBadge.roles = badgeData.roles;
        existingBadge.requirementType = badgeData.requirementType;
        existingBadge.requirementValue = badgeData.requirementValue;
        if (badgeData.category) existingBadge.category = badgeData.category;
        existingBadge.rarity = badgeData.rarity;
        await existingBadge.save();
      }
    }
  } catch (error) {
    console.error("[Seed] Error seeding achievements:", error.message);
  }
};

export default seedAchievements;
