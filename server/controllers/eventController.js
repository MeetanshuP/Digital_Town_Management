const Event = require("../models/event");

/* ================= GET ALL EVENTS ================= */

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .sort({ eventDate: 1, eventTime: 1 });

        return res.status(200).json(events);
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= GET EVENT BY ID ================= */

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        return res.status(200).json(event);
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= CREATE EVENT ================= */

exports.createEvent = async (req, res) => {
    try {
        const { title, description, eventDate, eventTime } = req.body;

        if (!title || !eventDate) {
            return res.status(400).json({
                message: "Title and event date are required",
            });
        }

        const date = new Date(eventDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date < today) {
            return res.status(400).json({
                message: "Event date cannot be in the past",
            });
        }

        const event = await Event.create({
            title,
            description,
            eventDate,
            eventTime,
            status: "upcoming",
        });

        return res.status(201).json({
            message: "Event created successfully",
            event,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= UPDATE EVENT ================= */

exports.updateEvent = async (req, res) => {
    try {
        const { title, description, eventDate, eventTime, status } = req.body;

        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (title) event.title = title;
        if (description) event.description = description;
        if (eventTime) event.eventTime = eventTime;

        if (eventDate) {
            const date = new Date(eventDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (date < today) {
                return res.status(400).json({
                    message: "Event date cannot be in the past",
                });
            }

            event.eventDate = eventDate;
        }

        if (status) event.status = status;

        await event.save();

        return res.status(200).json({
            message: "Event updated successfully",
            event,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

/* ================= DELETE EVENT ================= */

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        await event.deleteOne();

        return res.status(200).json({
            message: "Event deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};
