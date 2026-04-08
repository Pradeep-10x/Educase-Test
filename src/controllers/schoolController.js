import pool from '../config/db.js';
import haversineDistance from '../utils/distance.js';

// POST /addSchool
export const addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    //Validation 
    const errors = [];

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      errors.push('name is required');
    }

    if (!address || typeof address !== 'string' || address.trim().length === 0) {
      errors.push('address is required');
    }

    if (latitude === undefined || latitude === null || typeof latitude !== 'number' || isNaN(latitude)) {
      errors.push('latitude is required');
    } else if (latitude < -90 || latitude > 90) {
      errors.push('latitude must be between -90 and 90');
    }

    if (longitude === undefined || longitude === null || typeof longitude !== 'number' || isNaN(longitude)) {
      errors.push('longitude is required');
    } else if (longitude < -180 || longitude > 180) {
      errors.push('longitude must be between -180 and 180');
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Insert 
    const [result] = await pool.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name.trim(), address.trim(), latitude, longitude]
    );

    return res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: {
        id: result.insertId,
        name: name.trim(),
        address: address.trim(),
        latitude,
        longitude,
      },
    });
  } catch (error) {
    console.error('addSchool error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /listSchools
export const listSchools = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    // Validation  
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        success: false,
        message: 'latitude and longitude query parameters are required',
      });
    }

    if (lat < -90 || lat > 90) {
      return res.status(400).json({ success: false, message: 'latitude must be between -90 and 90' });
    }

    if (lon < -180 || lon > 180) {
      return res.status(400).json({ success: false, message: 'longitude must be between -180 and 180' });
    }

    // Fetch and sort 
    const [schools] = await pool.execute('SELECT * FROM schools');

    const sorted = schools
      .map((school) => ({
        ...school,
        distance: parseFloat(
          haversineDistance(lat, lon, school.latitude, school.longitude).toFixed(2)
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    return res.json({ success: true, count: sorted.length, data: sorted });
  } catch (error) {
    console.error('listSchools error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
