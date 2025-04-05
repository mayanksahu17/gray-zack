// reservationController.js
export const findReservationByNumber = async (req, res) => {
    try {
      // Find reservation using reservationNumber
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };    