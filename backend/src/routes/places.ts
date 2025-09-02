import express from 'express';
import { Place } from '../models/Place';
import { Log } from '../models/Log';

const router = express.Router();

// Get all places
router.get('/', async (req, res) => {
  try {
    const places = await Place.findAll();
    res.json(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

// Get places by store number
router.get('/store/:storeNumber', async (req, res) => {
  try {
    const { storeNumber } = req.params;
    const places = await Place.findByStoreNumber(storeNumber);
    res.json(places);
  } catch (error) {
    console.error('Error fetching places by store:', error);
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

// Get place by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid place ID' });
    }
    
    const place = await Place.findById(id);
    res.json(place);
  } catch (error) {
    console.error('Error fetching place:', error);
    if (error instanceof Error && error.message === 'Place not found') {
      res.status(404).json({ error: 'Place not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch place' });
    }
  }
});

// Create new place
router.post('/', async (req, res) => {
  try {
    const { store_number, name, color, table_count, user_pin } = req.body;
    
    // Validation
    if (!store_number || !name || !color || !user_pin) {
      return res.status(400).json({ 
        error: 'Missing required fields: store_number, name, color, user_pin' 
      });
    }
    
    const newPlace = await Place.create({
      store_number,
      name,
      color,
      table_count: table_count || 0,
      user_pin
    });
    
    // Log the creation
    await Log.create({
      type: 'PLACE_CREATED',
      message: `Place "${name}" created at store ${store_number}`,
      user_pin,
      store_number,
      place_name: name,
      metadata: JSON.stringify({ color, table_count: table_count || 0 })
    });
    
    res.status(201).json(newPlace);
  } catch (error) {
    console.error('Error creating place:', error);
    res.status(500).json({ error: 'Failed to create place' });
  }
});

// Update place
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid place ID' });
    }
    
    const updates = req.body;
    const updatedPlace = await Place.update(id, updates);
    
    // Log the update
    if (updates.user_pin) {
      await Log.create({
        type: 'PLACE_UPDATED',
        message: `Place "${updatedPlace.name}" updated`,
        user_pin: updates.user_pin,
        store_number: updatedPlace.store_number,
        place_name: updatedPlace.name,
        metadata: JSON.stringify(updates)
      });
    }
    
    res.json(updatedPlace);
  } catch (error) {
    console.error('Error updating place:', error);
    if (error instanceof Error && error.message === 'Place not found') {
      res.status(404).json({ error: 'Place not found' });
    } else {
      res.status(500).json({ error: 'Failed to update place' });
    }
  }
});

// Delete place
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid place ID' });
    }
    
    // Get place details before deletion for logging
    const place = await Place.findById(id);
    const deleted = await Place.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Place not found' });
    }
    
    // Log the deletion
    await Log.create({
      type: 'PLACE_DELETED',
      message: `Place "${place.name}" deleted from store ${place.store_number}`,
      user_pin: place.user_pin,
      store_number: place.store_number,
      place_name: place.name
    });
    
    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    console.error('Error deleting place:', error);
    if (error instanceof Error && error.message === 'Place not found') {
      res.status(404).json({ error: 'Place not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete place' });
    }
  }
});

export default router;