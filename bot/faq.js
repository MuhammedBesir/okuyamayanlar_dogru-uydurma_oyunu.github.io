const faqs = {
    "what is buarada.app?": "Buarada.app is a platform that connects people with local events. You can discover happenings in your area or promote your own events!",
    "how can i join an event?": "To join an event, you usually just follow the instructions provided by the event organizer. This might involve registering on their website, buying a ticket, or simply showing up if it's a free event. Buarada.app helps you find these events!",
    "how does the platform work?": "Event organizers submit their events to Buarada.app. We then feature these events, making them discoverable to a wider audience. Users can browse these events and find things that interest them.",
    "is it free to use?": "Yes, Buarada.app is free for users looking for events! For event organizers, there might be different plans or options, but basic event submission is typically free."
};

function getAnswer(question) {
    const lowerQuestion = question.toLowerCase().trim();
    return faqs[lowerQuestion] || null;
}

module.exports = { getAnswer };
