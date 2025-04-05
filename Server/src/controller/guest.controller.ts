exports.createGuest = async (req, res) => {
    try {
      // Logic to check if guest exists, else create
      // Return guest ID
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };