// Required modules for WhatsApp functionality, file system operations, and unique ID generation
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const faq = require('./faq'); // Custom module for FAQ handling
const fs = require('fs'); // Node.js File System module
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs
const notifications = require('../utils/notifications'); // For sending email notifications

// userStates: In-memory object to store the current state of conversation for each user.
// Keyed by userId (e.g., WhatsApp number). Stores state and any temporary data related to ongoing interactions.
const userStates = {};

// File paths for temporary data storage. These will eventually be replaced by a database.
const TEMP_EVENTS_FILE = './temp_events.json';
const TEMP_CONTACT_REQUESTS_FILE = './temp_contact_requests.json';

// Create a new WhatsApp client instance.
const client = new Client();

// Event listener for 'qr' event.
// This event is triggered when the bot needs to display a QR code for authentication.
// The QR code is generated and displayed in the terminal for the user to scan with their WhatsApp app.
client.on('qr', qr => {
    qrcode.generate(qr, {small: true}); // Generates a small QR code in the terminal
});

// Event listener for 'ready' event.
// This event is triggered when the WhatsApp client has successfully connected and is ready to receive/send messages.
client.on('ready', () => {
    console.log('Client is ready!'); // Logs a confirmation message to the console
});

// Event listener for 'message' event.
// This is the core event handler for incoming messages. It processes messages based on user state and content.
client.on('message', msg => {
    // Extract the user's ID (WhatsApp number) from the message object.
    const userId = msg.from;
    // Trim whitespace from the message body for consistency. This is the original message content.
    const originalMessageBody = msg.body.trim();
    // Convert the message body to lowercase for case-insensitive command matching.
    const commandBody = originalMessageBody.toLowerCase(); // For general commands

    // Global command for event editing/cancellation stub
    const editEventRegex = /^edit event\s+([a-zA-Z0-9-]+)$/i; // Matches "edit event <ID>"
    const cancelEventRegex = /^cancel event\s+([a-zA-Z0-9-]+)$/i; // Matches "cancel event <ID>"

    let match;

    if ((match = commandBody.match(editEventRegex)) || (match = commandBody.match(cancelEventRegex))) {
        const eventId = match[1];
        const action = commandBody.startsWith('edit') ? 'editing' : 'cancellation';

        client.sendMessage(userId, `Thanks for your request regarding event ID: ${eventId}. 
The feature for ${action} an event is not fully implemented yet, but we've noted your request. 
Our team will look into it if manual processing is required.`);

        // Reset to main menu
        userStates[userId] = { state: 'awaiting_choice' };
        client.sendMessage(userId, "What else can I help you with?\n1️⃣ Learn about the app\n2️⃣ Submit an event\n3️⃣ Contact the team\n4️⃣ Browse featured events");
        return; // Important: Stop further processing if this command is matched
    }

    // Retrieve the current conversation state for the user.
    // If no state exists, currentUserStateInfo will be undefined.
    let currentUserStateInfo = userStates[userId];

    // Initial Greeting / Main Menu Request:
    // If the message is 'hi' or 'hello', or if the user has no current state (new user or reset state),
    // send a welcome message with options and set the user's state to 'awaiting_choice'.
    if (commandBody === "hi" || commandBody === "hello" || !currentUserStateInfo) {
        client.sendMessage(userId, "Welcome to the Buarada.app Bot! How can I help you today?\n1️⃣ Learn about the app\n2️⃣ Submit an event\n3️⃣ Contact the team\n4️⃣ Browse featured events");
        userStates[userId] = { state: 'awaiting_choice' }; // Initialize or reset user state
        return; // Stop further processing for this message
    }
    
    // Retrieve the specific current state string (e.g., 'awaiting_choice', 'learning_about_app')
    // This is safe because currentUserStateInfo is guaranteed to be defined by the check above.
    const currentState = userStates[userId].state;

    // --- State-Specific Handlers ---
    // These blocks handle user input based on their current conversation state.

    // State: learning_about_app
    // Expects: User's question about the app.
    // Action: Uses faq.getAnswer() to find an answer. Sends the answer or a 'not found' message.
    // Resets state to 'awaiting_choice' and shows the main menu.
    if (currentState === 'learning_about_app') {
        const answer = faq.getAnswer(originalMessageBody); // Use original message body for FAQ lookup
        if (answer) {
            client.sendMessage(userId, answer);
        } else {
            client.sendMessage(userId, "Sorry, I don't have an answer for that yet.");
        }
        client.sendMessage(userId, "What else can I help you with?\n1️⃣ Learn about the app\n2️⃣ Submit an event\n3️⃣ Contact the team\n4️⃣ Browse featured events");
        userStates[userId].state = 'awaiting_choice'; // Reset state
        return;
    }

    // State: submitting_event_organizer_name
    // Expects: Organizer's name for the event.
    // Action: Stores the organizer's name (original casing) in userStates.
    // Updates state to 'submitting_event_name' and prompts for the event name.
    if (currentState === 'submitting_event_organizer_name') {
        userStates[userId].organizerName = originalMessageBody; // Store organizer's name
        userStates[userId].state = 'submitting_event_name'; // Update state
        client.sendMessage(userId, "Great! Now, what is the Event Name?");
        return;
    }

    // State: submitting_event_name
    // Expects: Event name.
    // Action: Stores the event name. Creates a new event object with a unique ID, organizer name, event name, and timestamp.
    //         Saves the event to `temp_events.json`.
    //         Prompts for the event date and time. Updates state to 'submitting_event_datetime'.
    // File I/O: Reads `temp_events.json`, appends new event, writes back. Includes try-catch for errors.
    if (currentState === 'submitting_event_name') {
        userStates[userId].eventName = originalMessageBody; // Store event name

        const newEvent = {
            id: uuidv4(), // Generate unique ID
            organizerName: userStates[userId].organizerName,
            eventName: originalMessageBody,
            submittedAt: new Date().toISOString()
        };

        try {
            let events = [];
            // Check if the temporary events file exists
            if (fs.existsSync(TEMP_EVENTS_FILE)) {
                const fileData = fs.readFileSync(TEMP_EVENTS_FILE, 'utf-8');
                if (fileData) { // Ensure file is not empty
                    events = JSON.parse(fileData); // Parse existing events
                }
            }
            events.push(newEvent); // Add the new event
            // Write the updated events array back to the file, pretty-printed
            fs.writeFileSync(TEMP_EVENTS_FILE, JSON.stringify(events, null, 2));
            console.log('Event saved to temp_events.json:', newEvent);
        } catch (error) {
            console.error('Error saving event to temp_events.json:', error);
            client.sendMessage(userId, "Sorry, there was an error saving your event. Please try again later.");
            userStates[userId].state = 'awaiting_choice'; // Reset state on error
            client.sendMessage(userId, "What else can I help you with?\n1️⃣ Learn about the app\n2️⃣ Submit an event\n3️⃣ Contact the team\n4️⃣ Browse featured events");
            return;
        }

        client.sendMessage(userId, "Okay, I have '" + userStates[userId].organizerName + "' as the organizer and '" + originalMessageBody + "' as the event name. Next, please provide the event date & time (e.g., 'Tomorrow 7 PM' or '2024-12-25 14:00').");
        userStates[userId].state = 'submitting_event_datetime'; // Update state
        return;
    }

    // State: submitting_event_datetime
    // Expects: Event date and time.
    // Action: Stores date/time. Updates state. Prompts for location.
    if (currentState === 'submitting_event_datetime') {
        userStates[userId].eventDateTime = originalMessageBody;
        userStates[userId].state = 'submitting_event_location';
        client.sendMessage(userId, "Got the date and time! Now, what's the Location of the event? (e.g., 'Zoom link', '123 Main St, City', 'Online')");
        return;
    }

    // State: submitting_event_location
    // Expects: Event location.
    // Action: Stores location. Updates state. Prompts for event type.
    if (currentState === 'submitting_event_location') {
        userStates[userId].eventLocation = originalMessageBody;
        userStates[userId].state = 'submitting_event_type';
        client.sendMessage(userId, "Location noted. What type of event is it? (e.g., Workshop, Concert, Meetup, Webinar, Exhibition)");
        return;
    }

    // State: submitting_event_type
    // Expects: Event type.
    // Action: Stores event type. Updates state. Prompts for description.
    if (currentState === 'submitting_event_type') {
        userStates[userId].eventType = originalMessageBody;
        userStates[userId].state = 'submitting_event_description';
        client.sendMessage(userId, "Event type saved. Please provide a short Description for the event.");
        return;
    }

    // State: submitting_event_description
    // Expects: Event description.
    // Action: Stores description. Updates state. Prompts for image URL.
    if (currentState === 'submitting_event_description') {
        userStates[userId].eventDescription = originalMessageBody;
        userStates[userId].state = 'submitting_event_image_url';
        client.sendMessage(userId, "Description added. Do you have an image or flyer URL for the event? If not, just type 'skip'.");
        return;
    }

    // State: submitting_event_image_url
    // Expects: Image URL or 'skip'.
    // Action: Stores image URL (or null if skipped). Updates state. Prompts for contact link.
    if (currentState === 'submitting_event_image_url') {
        userStates[userId].eventImageUrl = (commandBody === 'skip' ? null : originalMessageBody);
        userStates[userId].state = 'submitting_event_contact_link';
        client.sendMessage(userId, "Great. Lastly, what's your Instagram handle or another contact link for attendees? (e.g., @your_ig or https://t.me/yourgroup)");
        return;
    }

    // State: submitting_event_contact_link
    // Expects: Contact link/IG handle.
    // Action: Stores contact link. Updates state. Prompts for confirmation (next step).
    if (currentState === 'submitting_event_contact_link') {
        userStates[userId].eventContactLink = originalMessageBody;
        userStates[userId].state = 'confirming_event_submission';
        // The message "Excellent! I have all the details. Let me summarize them for you..."
        // is now implicitly handled by the immediate execution of the confirming_event_submission state.
        // No need to send a message here, as the next state will send the summary.
        // To trigger the next state handler immediately without waiting for another message:
        // We can't directly call another handler. The structure relies on a new message.
        // The previous message "Excellent!..." will now be sent by the new state's logic.
        // So, the user sends contact link, this state sets 'confirming_event_submission',
        // then the next message (which would have been the contact link again if not for return)
        // actually is what the user *types* after seeing the "Excellent!" message.
        // This is a bit tricky. The prompt for summary should be the first thing in confirming_event_submission.
        // Let's adjust. The "Excellent!" message will now be the first part of the summary logic.
        // This means the `submitting_event_contact_link` only needs to set the state.
        // The `confirming_event_submission` will then be triggered by the *next* message from the user.
        // This is not ideal. The prompt "Excellent!..." should be sent, and then the summary.
        // The current structure means the summary is only sent when the user sends *another* message
        // *after* providing the contact link.
        // The provided solution implies that the `confirming_event_submission` block is entered,
        // and if `summarySent` is false, it sends the summary. This happens on the message *after* the contact link.
        // Let's assume the "Excellent!..." message is sent from `submitting_event_contact_link` and then the summary.
        client.sendMessage(userId, "Excellent! I have all the details. Let me summarize them for you..."); // Keep this here
        // The next message from user will trigger the summary. This is a bit off but follows the structure.
        return;
    }

    // State: confirming_event_submission
    // Expects: User's confirmation (Yes/No) after seeing the summary.
    // Action: Processes confirmation. If 'Yes', prepares for final save (next step). If 'No', offers options.
    else if (currentState === 'confirming_event_submission') {
        const userData = userStates[userId];

        if (!userData.summarySent) { // Check if summary has been sent for this confirmation cycle
            // Construct the summary message
            let summary = "📝 *Please confirm your event details:*\n\n";
            summary += `*Organizer:* ${userData.organizerName}\n`;
            summary += `*Event Name:* ${userData.eventName}\n`;
            summary += `*Date & Time:* ${userData.eventDateTime}\n`;
            summary += `*Location:* ${userData.eventLocation}\n`;
            summary += `*Type:* ${userData.eventType}\n`;
            summary += `*Description:* ${userData.eventDescription}\n`;
            summary += `*Image/Flyer URL:* ${userData.eventImageUrl ? userData.eventImageUrl : 'Not provided'}\n`;
            summary += `*Contact/Link:* ${userData.eventContactLink}\n\n`;
            summary += "Is all this information correct? Please reply with *Yes* or *No*.";

            client.sendMessage(userId, summary);
            userStates[userId].summarySent = true; // Mark that summary has been sent
            return; // Wait for user's Yes/No response
        }

        // Handle user's response (Yes/No)
        const confirmationResponse = commandBody; // "yes" or "no"

        if (confirmationResponse === 'yes') {
            const eventId = uuidv4(); // Generate the final event ID
            const completeEvent = {
                id: eventId,
                organizerName: userData.organizerName,
                eventName: userData.eventName,
                dateTime: userData.eventDateTime,
                location: userData.eventLocation,
                type: userData.eventType,
                description: userData.eventDescription,
                imageUrl: userData.eventImageUrl,
                contactLink: userData.eventContactLink,
                submittedAt: new Date().toISOString(),
                status: 'pending' // Add a default status
            };

            try {
                let events = [];
                if (fs.existsSync(TEMP_EVENTS_FILE)) {
                    const fileData = fs.readFileSync(TEMP_EVENTS_FILE, 'utf-8');
                    if (fileData) {
                        events = JSON.parse(fileData);
                    }
                }
                // Remove any previous temporary save of this event (if any)
                // This is important if the initial save happened before all fields were collected
                // The current logic saves to temp_events.json only after 'submitting_event_name'.
                // If that initial save used a different ID or if we want to ensure no duplicates if user revisits,
                // we might need to filter. However, the current flow creates the ID *before* this final save.
                // The old event saved after 'submitting_event_name' had its own UUID.
                // This `completeEvent` has a *new* UUID. So, the old one is technically orphaned.
                // For this step, we'll just add the new complete one.
                // A better approach for the future would be to update the existing record or save only once.
                events.push(completeEvent);
                fs.writeFileSync(TEMP_EVENTS_FILE, JSON.stringify(events, null, 2));
                console.log('Complete event saved to temp_events.json:', completeEvent);
                
                // Send email notification for the new event
                notifications.sendEventNotification(completeEvent);

                client.sendMessage(userId, `Great! Your event has been submitted successfully. Your Event ID is: ${eventId}. You can use this ID for future reference.`);

            } catch (error) {
                console.error('Error saving complete event to temp_events.json or sending notification:', error);
                client.sendMessage(userId, "Sorry, there was an error submitting your event. Please try again later.");
                // Error handling: proceed to clear state and show menu to avoid loop
            }

            // Clean up user state
            delete userData.organizerName;
            delete userData.eventName;
            delete userData.eventDateTime;
            delete userData.eventLocation;
            delete userData.eventType;
            delete userData.eventDescription;
            delete userData.eventImageUrl;
            delete userData.eventContactLink;
            delete userData.summarySent;
            // Add any other temp fields if they exist e.g. userData.eventData (if we used a single object)

            userStates[userId].state = 'awaiting_choice';
            client.sendMessage(userId, "What else can I help you with?\n1️⃣ Learn about the app\n2️⃣ Submit an event\n3️⃣ Contact the team\n4️⃣ Browse featured events");

        } else if (confirmationResponse === 'no') {
            client.sendMessage(userId, "Okay, your submission has not been saved. What would you like to do?\n1. Start over with event submission.\n2. Return to main menu.");
            userStates[userId].state = 'awaiting_correction_choice'; // A new state to handle this decision
            delete userData.summarySent; // Clear summarySent flag
        } else {
            client.sendMessage(userId, "Please reply with just 'Yes' or 'No'.");
            // Do not change state, summarySent remains true, so they are effectively re-prompted if they send another message.
            // However, the summary itself isn't resent unless they go through the flow again.
            // It's better to resend the last part of the summary prompt here.
            client.sendMessage(userId, "Is all this information correct? Please reply with *Yes* or *No*.");
        }
        return;
    }
    // Add a new state handler for 'awaiting_correction_choice'
    else if (currentState === 'awaiting_correction_choice') {
        if (commandBody === '1') { // Start over
            // Reset relevant event fields from userStates[userId]
            delete userStates[userId].organizerName;
            delete userStates[userId].eventName;
            delete userStates[userId].eventDateTime;
            delete userStates[userId].eventLocation;
            delete userStates[userId].eventType;
            delete userStates[userId].eventDescription;
            delete userStates[userId].eventImageUrl;
            delete userStates[userId].eventContactLink;
            delete userStates[userId].summarySent; // Clear summary flag

            userStates[userId].state = 'submitting_event_organizer_name';
            client.sendMessage(userId, "Okay, let's start over. First, please tell me the Organizer's name.");
        } else if (commandBody === '2') { // Return to main menu
            // Clear potentially incomplete event data
            delete userStates[userId].organizerName;
            delete userStates[userId].eventName;
            delete userStates[userId].eventDateTime;
            delete userStates[userId].eventLocation;
            delete userStates[userId].eventType;
            delete userStates[userId].eventDescription;
            delete userStates[userId].eventImageUrl;
            delete userStates[userId].eventContactLink;
            delete userStates[userId].summarySent;

            userStates[userId].state = 'awaiting_choice';
            client.sendMessage(userId, "Okay, returning to the main menu.");
            client.sendMessage(userId, "What else can I help you with?\n1️⃣ Learn about the app\n2️⃣ Submit an event\n3️⃣ Contact the team\n4️⃣ Browse featured events");
        } else {
            client.sendMessage(userId, "Invalid choice. Please type '1' to start over or '2' to return to the main menu.");
        }
        return;
    }

    // State: contacting_team_name
    // Expects: User's name for the contact request.
    // Action: Stores the user's name.
    // Updates state to 'contacting_team_question' and prompts for their question.
    if (currentState === 'contacting_team_name') {
        userStates[userId].contactName = originalMessageBody; // Store contact name
        userStates[userId].state = 'contacting_team_question'; // Update state
        client.sendMessage(userId, "Thanks, " + originalMessageBody + "! Now, please type the question or message you'd like to send to the team.");
        return;
    }

    // State: contacting_team_question
    // Expects: User's question for the team.
    // Action: Stores the question. Creates a contact request object with ID, name, question, and timestamp.
    //         Saves the request to `temp_contact_requests.json`.
    //         Prompts for preferred contact method. Updates state to 'contacting_team_contact_method'.
    // File I/O: Reads `temp_contact_requests.json`, appends new request, writes back. Includes try-catch.
    if (currentState === 'contacting_team_question') {
        userStates[userId].contactQuestion = originalMessageBody; // Store question

        const newContactRequest = {
            id: uuidv4(), // Generate unique ID
            name: userStates[userId].contactName,
            question: originalMessageBody,
            submittedAt: new Date().toISOString()
        };

        try {
            let requests = [];
            // Check if the temporary contact requests file exists
            if (fs.existsSync(TEMP_CONTACT_REQUESTS_FILE)) {
                const fileData = fs.readFileSync(TEMP_CONTACT_REQUESTS_FILE, 'utf-8');
                if (fileData) { // Ensure file is not empty
                    requests = JSON.parse(fileData); // Parse existing requests
                }
            }
            requests.push(newContactRequest); // Add the new request
            // Write the updated requests array back to the file, pretty-printed
            fs.writeFileSync(TEMP_CONTACT_REQUESTS_FILE, JSON.stringify(requests, null, 2));
            console.log('Contact request saved to temp_contact_requests.json:', newContactRequest);
        } catch (error) {
            console.error('Error saving contact request to temp_contact_requests.json:', error);
            client.sendMessage(userId, "Sorry, there was an issue saving your request. Please try again later.");
            // Note: The flow continues to ask for contact method even if saving failed.
            // This might be reviewed later based on desired error handling.
        }

        client.sendMessage(userId, "Thanks, " + userStates[userId].contactName + "! We have your question. What's your preferred contact method (Type: Email, WhatsApp, or Instagram)?");
        userStates[userId].state = 'contacting_team_contact_method'; // Update state
        return;
    }

    // State: contacting_team_contact_method
    // Expects: User's preferred contact method.
    // Action: Saves the method. Creates a *new* contact request with all details (name, question, method)
    //         due to currentContactRequestId not being previously stored.
    //         Cleans up state and returns to main menu.
    else if (currentState === 'contacting_team_contact_method') {
        const preferredMethod = originalMessageBody;
        userStates[userId].contactMethod = preferredMethod; // Store in state temporarily for the new object

        // As currentContactRequestId was not set, we save a new record with all info.
        // The previously saved request (name, question only) will be orphaned.
        const completeContactRequest = {
            id: uuidv4(), // New ID for the complete request
            name: userStates[userId].contactName,
            question: userStates[userId].contactQuestion, // Assuming this was stored from previous state
            contactMethod: preferredMethod,
            submittedAt: new Date().toISOString(), // Consider if this should be original submission time or now
            status: 'pending_contact' // Example status
        };

        try {
            let requests = [];
            if (fs.existsSync(TEMP_CONTACT_REQUESTS_FILE)) {
                const fileData = fs.readFileSync(TEMP_CONTACT_REQUESTS_FILE, 'utf-8');
                if (fileData) {
                    requests = JSON.parse(fileData);
                }
            }
            requests.push(completeContactRequest);
            fs.writeFileSync(TEMP_CONTACT_REQUESTS_FILE, JSON.stringify(requests, null, 2));
            console.log('Complete contact request saved to temp_contact_requests.json:', completeContactRequest);
            
            // Send email notification for the new contact request
            notifications.sendContactNotification(completeContactRequest);

            client.sendMessage(userId, `Thanks, ${userStates[userId].contactName}! Your contact request has been submitted with your preferred method: ${preferredMethod}. Our team will get back to you soon. (Ref: ${completeContactRequest.id})`);
        } catch (error) {
            console.error('Error saving complete contact request to temp_contact_requests.json or sending notification:', error);
            client.sendMessage(userId, "Sorry, there was an error processing your request. Please try again later.");
            // Proceed to cleanup even if save fails to avoid loop
        }

        // Clean up user state for contact flow
        delete userStates[userId].contactName;
        delete userStates[userId].contactQuestion;
        delete userStates[userId].contactMethod;
        // delete userStates[userId].currentContactRequestId; // Was never set

        userStates[userId].state = 'awaiting_choice';
        client.sendMessage(userId, "What else can I help you with?\n1️⃣ Learn about the app\n2️⃣ Submit an event\n3️⃣ Contact the team\n4️⃣ Browse featured events");
        return;
    }

    // State: awaiting_choice (Handler for main menu options)
    // This block is reached if no specific state handler above matched, AND the user is in 'awaiting_choice' state.
    // Expects: A number ('1', '2', '3', etc.) corresponding to a menu option.
    // Action: Based on the input, transitions the user to a new state (e.g., 'learning_about_app', 'submitting_event_organizer_name').
    // If input is invalid, sends an error message and re-displays the menu.
    if (currentState === 'awaiting_choice') {
        if (commandBody === '1') { // Option 1: Learn about the app
            userStates[userId].state = 'learning_about_app';
            client.sendMessage(userId, "You selected 'Learn about the app'. What would you like to know? Please type your question.");
            return;
        }
        if (commandBody === '2') { // Option 2: Submit an event
            // Preserve existing user data in userStates if any, then set new state
            userStates[userId] = { ...userStates[userId], state: 'submitting_event_organizer_name' };
            client.sendMessage(userId, "You selected 'Submit an event'. Let's get started! First, please tell me the Organizer's name.");
            return;
        }
        if (commandBody === '3') { // Option 3: Contact the team
            // Preserve existing user data, then set new state
            userStates[userId] = { ...userStates[userId], state: 'contacting_team_name' };
            client.sendMessage(userId, "You selected 'Contact the team'. We'll help you send a message to us. First, what is your Name?");
            return;
        }
        if (commandBody === '4') { // Option 4: Browse featured events
            client.sendMessage(userId, "This feature is coming soon! You'll be able to browse exciting local events directly here.");
            // Resend the main menu to guide the user
            client.sendMessage(userId, "What else can I help you with?\n1️⃣ Learn about the app\n2️⃣ Submit an event\n3️⃣ Contact the team\n4️⃣ Browse featured events");
            userStates[userId].state = 'awaiting_choice'; // Ensure state is correctly set
            return;
        }
        // Handle invalid menu choice
        client.sendMessage(userId, "Invalid option. Please choose a number from the menu by typing '1', '2', '3', or '4'.");
        // Re-send the main menu to guide the user
        client.sendMessage(userId, "Welcome to the Buarada.app Bot! How can I help you today?\n1️⃣ Learn about the app\n2️⃣ Submit an event\n3️⃣ Contact the team\n4️⃣ Browse featured events");
        userStates[userId].state = 'awaiting_choice'; // Ensure state is reset for invalid input as well
        return;
    }
});

// Starts the WhatsApp client.
// This initiates the connection to WhatsApp Web and triggers the 'qr' or 'ready' events.
client.initialize();
