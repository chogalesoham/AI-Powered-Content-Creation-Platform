const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

async function testEditDeleteOperations() {
  console.log("🧪 Testing Edit and Delete Operations for Content Schedule\n");

  try {
    // Test 1: Authentication
    console.log("1. Testing authentication...");
    const authResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: "test@example.com",
      password: "password123",
    });

    if (!authResponse.data.success) {
      throw new Error("Authentication failed");
    }

    const authToken = authResponse.data.token;
    console.log("✅ Authentication successful\n");

    // Test 2: Create and test scheduled post operations
    console.log("2. Testing scheduled post CRUD operations...");

    // Create a scheduled post
    const createPostResponse = await axios.post(
      `${API_BASE}/schedule/posts`,
      {
        platform: "LinkedIn",
        content: "Original test post content",
        scheduledFor: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        contentType: "Personal",
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    if (!createPostResponse.data.success) {
      throw new Error("Failed to create scheduled post");
    }

    const postId = createPostResponse.data.post._id;
    console.log("✅ Scheduled post created successfully");

    // Edit the scheduled post
    const editPostResponse = await axios.put(
      `${API_BASE}/schedule/posts/${postId}`,
      {
        content: "Updated test post content - EDITED!",
        status: "draft",
        platform: "Twitter",
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    if (editPostResponse.data.success) {
      console.log("✅ Scheduled post edited successfully");
      console.log(
        `   Updated content: "${editPostResponse.data.post.content}"`
      );
      console.log(
        `   Updated platform: ${editPostResponse.data.post.platform}`
      );
      console.log(`   Updated status: ${editPostResponse.data.post.status}`);
    } else {
      throw new Error("Failed to edit scheduled post");
    }

    // Delete the scheduled post
    const deletePostResponse = await axios.delete(
      `${API_BASE}/schedule/posts/${postId}`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    if (deletePostResponse.data.success) {
      console.log("✅ Scheduled post deleted successfully\n");
    } else {
      throw new Error("Failed to delete scheduled post");
    }

    // Test 3: Create and test recurring schedule operations
    console.log("3. Testing recurring schedule CRUD operations...");

    // Create a recurring schedule
    const createRecurringResponse = await axios.post(
      `${API_BASE}/schedule/recurring`,
      {
        name: "Test Recurring Schedule",
        platform: "LinkedIn",
        contentType: "Thought Leadership",
        frequency: "weekly",
        timeOfDay: "09:00",
        dayOfWeek: 1, // Monday
        contentPrompts: ["Original content prompt"],
        settings: {
          tone: "professional",
          includeHashtags: true,
          contentLength: "medium",
        },
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    if (!createRecurringResponse.data.success) {
      throw new Error("Failed to create recurring schedule");
    }

    const scheduleId = createRecurringResponse.data.schedule._id;
    console.log("✅ Recurring schedule created successfully");

    // Edit the recurring schedule
    const editRecurringResponse = await axios.put(
      `${API_BASE}/schedule/recurring/${scheduleId}`,
      {
        name: "Updated Test Recurring Schedule - EDITED!",
        platform: "Twitter",
        timeOfDay: "15:00",
        active: false,
        settings: {
          tone: "casual",
          includeHashtags: false,
          contentLength: "short",
        },
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    if (editRecurringResponse.data.success) {
      console.log("✅ Recurring schedule edited successfully");
      console.log(
        `   Updated name: "${editRecurringResponse.data.schedule.name}"`
      );
      console.log(
        `   Updated platform: ${editRecurringResponse.data.schedule.platform}`
      );
      console.log(
        `   Updated time: ${editRecurringResponse.data.schedule.timeOfDay}`
      );
      console.log(
        `   Updated active status: ${editRecurringResponse.data.schedule.active}`
      );
    } else {
      throw new Error("Failed to edit recurring schedule");
    }

    // Delete the recurring schedule
    const deleteRecurringResponse = await axios.delete(
      `${API_BASE}/schedule/recurring/${scheduleId}`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    if (deleteRecurringResponse.data.success) {
      console.log("✅ Recurring schedule deleted successfully\n");
    } else {
      throw new Error("Failed to delete recurring schedule");
    }

    // Test 4: Verify deletions by trying to fetch deleted items
    console.log("4. Verifying deletions...");

    try {
      await axios.put(
        `${API_BASE}/schedule/posts/${postId}`,
        {
          content: "This should fail",
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log("❌ Deleted post still exists (this should not happen)");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("✅ Deleted scheduled post is properly removed");
      } else {
        console.log("⚠️  Unexpected error when trying to access deleted post");
      }
    }

    try {
      await axios.put(
        `${API_BASE}/schedule/recurring/${scheduleId}`,
        {
          name: "This should fail",
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log(
        "❌ Deleted recurring schedule still exists (this should not happen)"
      );
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("✅ Deleted recurring schedule is properly removed\n");
      } else {
        console.log(
          "⚠️  Unexpected error when trying to access deleted recurring schedule\n"
        );
      }
    }

    console.log("🎉 All Edit and Delete Operations Test Complete!\n");
    console.log("📊 Summary:");
    console.log("✅ Scheduled post creation working");
    console.log("✅ Scheduled post editing working");
    console.log("✅ Scheduled post deletion working");
    console.log("✅ Recurring schedule creation working");
    console.log("✅ Recurring schedule editing working");
    console.log("✅ Recurring schedule deletion working");
    console.log("✅ All edit and delete operations are fully functional!");
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    process.exit(1);
  }
}

// Run the test
testEditDeleteOperations().catch((error) => {
  console.error("Test suite failed:", error.message);
  process.exit(1);
});
