import express from 'express';
import { Log } from '../models/Log';
import { Place } from '../models/Place';
import { Category } from '../models/Category';
import { Menu } from '../models/Menu';

const router = express.Router();

// Get all logs
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const logs = await Log.findAll(limit);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// Get logs by store number
router.get('/store/:storeNumber', async (req, res) => {
  try {
    const { storeNumber } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const logs = await Log.findByStoreNumber(storeNumber, limit);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs by store:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// Get logs by type
router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const logs = await Log.findByType(type, limit);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs by type:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// Get log by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid log ID' });
    }
    
    const log = await Log.findById(id);
    res.json(log);
  } catch (error) {
    console.error('Error fetching log:', error);
    if (error instanceof Error && error.message === 'Log not found') {
      res.status(404).json({ error: 'Log not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch log' });
    }
  }
});

// Create new log
router.post('/', async (req, res) => {
  try {
    // Support both frontend format and direct API format
    const { 
      // Frontend format
      eventId, text, userId, storeNumber, timestamp, additionalData,
      // Direct API format
      type, message, user_pin, store_number, metadata 
    } = req.body;
    
    // Map frontend format to backend format
    const logType = type || eventId || 'general';
    const logMessage = message || text;
    const userPin = user_pin || userId;
    const storeNum = store_number || storeNumber;
    
    // Validation
    if (!logMessage) {
      return res.status(400).json({ 
        error: 'Missing required fields: message or text' 
      });
    }
    
    // Combine all metadata
    let combinedMetadata = metadata || {};
    
    // Handle additionalData from frontend (contains preData/postData)
    if (additionalData) {
      combinedMetadata = { ...combinedMetadata, ...additionalData };
    }

    const newLog = await Log.create({
      type: logType,
      message: logMessage,
      user_pin: userPin,
      store_number: storeNum,
      metadata: Object.keys(combinedMetadata).length > 0 ? JSON.stringify(combinedMetadata) : undefined
    });
    
    // Return success response in the format frontend expects
    res.status(201).json({ 
      success: true,
      data: newLog,
      message: 'Log created successfully'
    });
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({ error: 'Failed to create log' });
  }
});

// Undo log action
router.post('/:id/undo', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid log ID' });
    }
    
    // Get the log to undo
    const log = await Log.findById(id);
    
    let metadata;
    try {
      if (log.metadata) {
        // Try parsing once
        let parsed = JSON.parse(log.metadata);
        // If it's a string, try parsing again (double-encoded case)
        if (typeof parsed === 'string') {
          parsed = JSON.parse(parsed);
        }
        metadata = parsed;
      } else {
        metadata = {};
      }
    } catch (error) {
      console.error('Failed to parse metadata:', error);
      metadata = {};
    }
    
    let undoMessage = '';
    let undoSuccess = false;
    
    // Perform undo action based on log type
    switch (log.type) {
      case 'place_created': {
        // Delete the place that was created
        const placeName = metadata.postData?.placeName || metadata.postData?.name;
        if (placeName) {
          const deleted = await Place.deleteByName(placeName, log.store_number);
          if (deleted) {
            undoMessage = `${placeName} has been deleted by Undo`;
            undoSuccess = true;
          } else {
            return res.status(404).json({ error: `Place ${placeName} not found` });
          }
        } else {
          return res.status(400).json({ error: 'No place name found in metadata' });
        }
        break;
      }
      
      case 'place_modified':
      case 'place_updated': {
        // Restore place to previous state using preData
        const placeName = metadata.postData?.placeName || metadata.postData?.name;
        const preData = metadata.preData;
        
        if (placeName && preData) {
          // Find the place to update
          const place = await Place.findByName(placeName, log.store_number);
          if (place) {
            // Update with preData
            const updates = {
              name: preData.placeName || preData.name,
              color: preData.color,
              table_count: preData.table_count,
              store_number: preData.store_number,
              user_pin: preData.user_pin
            };
            
            if (place.id) {
              await Place.update(place.id, updates);
            } else {
              return res.status(500).json({ error: 'Place ID not found' });
            }
            undoMessage = `${placeName} has been modified by Undo`;
            undoSuccess = true;
          } else {
            return res.status(404).json({ error: `Place ${placeName} not found` });
          }
        } else {
          return res.status(400).json({ error: 'No place name or preData found in metadata' });
        }
        break;
      }
      
      case 'place_deleted': {
        // Recreate the place using preData
        const preData = metadata.preData;
        const placeName = preData?.placeName || preData?.name;
        
        if (preData && placeName) {
          const newPlace = await Place.create({
            store_number: preData.store_number || log.store_number,
            name: placeName,
            color: preData.color,
            table_count: preData.table_count || 0,
            user_pin: preData.user_pin || log.user_pin
          });
          
          undoMessage = `${placeName} has been created by Undo`;
          undoSuccess = true;
        } else {
          return res.status(400).json({ error: 'No preData found in metadata' });
        }
        break;
      }
      
      case 'category_created': {
        // Delete the category that was created
        const categoryName = metadata.postData?.categoryName || metadata.postData?.name;
        if (categoryName) {
          const deleted = await Category.deleteByName(categoryName, log.store_number);
          if (deleted) {
            undoMessage = `${categoryName} has been deleted by Undo`;
            undoSuccess = true;
          } else {
            return res.status(404).json({ error: `Category ${categoryName} not found` });
          }
        } else {
          return res.status(400).json({ error: 'No category name found in metadata' });
        }
        break;
      }
      
      case 'category_modified':
      case 'category_updated': {
        // Restore category to previous state using preData
        const categoryName = metadata.postData?.categoryName || metadata.postData?.name;
        const preData = metadata.preData;
        
        if (categoryName && preData) {
          // Find the category to update
          const category = await Category.findByName(categoryName, log.store_number);
          if (category) {
            // Update with preData
            const updates = {
              name: preData.categoryName || preData.name,
              color: preData.color,
              menu_count: preData.menu_count,
              store_number: preData.store_number,
              user_pin: preData.user_pin
            };
            
            if (category.id) {
              await Category.update(category.id, updates);
            } else {
              return res.status(500).json({ error: 'Category ID not found' });
            }
            undoMessage = `${categoryName} has been modified by Undo`;
            undoSuccess = true;
          } else {
            return res.status(404).json({ error: `Category ${categoryName} not found` });
          }
        } else {
          return res.status(400).json({ error: 'No category name or preData found in metadata' });
        }
        break;
      }
      
      case 'category_deleted': {
        // Recreate the category using preData
        const preData = metadata.preData;
        const categoryName = preData?.categoryName || preData?.name;
        
        if (preData && categoryName) {
          const newCategory = await Category.create({
            store_number: preData.store_number || log.store_number,
            name: categoryName,
            color: preData.color,
            menu_count: preData.menu_count || 0,
            user_pin: preData.user_pin || log.user_pin
          });
          
          undoMessage = `${categoryName} has been created by Undo`;
          undoSuccess = true;
        } else {
          return res.status(400).json({ error: 'No preData found in metadata' });
        }
        break;
      }
      
      case 'menu_created': {
        // Delete the menu that was created
        const menuName = metadata.postData?.menuName || metadata.postData?.name;
        if (menuName) {
          const deleted = await Menu.deleteByName(menuName, log.store_number);
          if (deleted) {
            undoMessage = `${menuName} has been deleted by Undo`;
            undoSuccess = true;
          } else {
            return res.status(404).json({ error: `Menu ${menuName} not found` });
          }
        } else {
          return res.status(400).json({ error: 'No menu name found in metadata' });
        }
        break;
      }
      
      case 'menu_modified':
      case 'menu_updated': {
        // Restore menu to previous state using preData
        const menuName = metadata.postData?.menuName || metadata.postData?.name;
        const preData = metadata.preData;
        
        if (menuName && preData) {
          // Find the menu to update
          const menu = await Menu.findByName(menuName, log.store_number);
          if (menu) {
            // Update with preData
            const updates = {
              name: preData.menuName || preData.name,
              category_id: preData.category_id,
              price: preData.price,
              description: preData.description,
              store_number: preData.store_number,
              user_pin: preData.user_pin
            };
            
            if (menu.id) {
              await Menu.update(menu.id, updates);
            } else {
              return res.status(500).json({ error: 'Menu ID not found' });
            }
            undoMessage = `${menuName} has been modified by Undo`;
            undoSuccess = true;
          } else {
            return res.status(404).json({ error: `Menu ${menuName} not found` });
          }
        } else {
          return res.status(400).json({ error: 'No menu name or preData found in metadata' });
        }
        break;
      }
      
      case 'menu_deleted': {
        // Recreate the menu using preData
        const preData = metadata.preData;
        const menuName = preData?.menuName || preData?.name;
        
        if (preData && menuName) {
          const newMenu = await Menu.create({
            category_id: preData.category_id,
            store_number: preData.store_number || log.store_number,
            name: menuName,
            price: preData.price || 0,
            description: preData.description,
            user_pin: preData.user_pin || log.user_pin
          });
          
          undoMessage = `${menuName} has been created by Undo`;
          undoSuccess = true;
        } else {
          return res.status(400).json({ error: 'No preData found in metadata' });
        }
        break;
      }
      
      default:
        return res.status(400).json({ error: `Undo not supported for log type: ${log.type}` });
    }
    
    // Create undo log entry
    if (undoSuccess) {
      await Log.create({
        type: 'undo',
        message: undoMessage,
        user_pin: log.user_pin,
        store_number: log.store_number,
        metadata: JSON.stringify({
          originalLogId: log.id,
          originalLogType: log.type,
          undoAction: log.type
        })
      });
    }
    
    res.json({ 
      success: undoSuccess,
      message: undoMessage,
      originalLog: log
    });
  } catch (error) {
    console.error('Error performing undo:', error);
    if (error instanceof Error && error.message === 'Log not found') {
      res.status(404).json({ error: 'Log not found' });
    } else {
      res.status(500).json({ error: 'Failed to perform undo' });
    }
  }
});

// Delete log (for undo functionality)
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid log ID' });
    }
    
    const deleted = await Log.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Log not found' });
    }
    
    res.json({ message: 'Log deleted successfully' });
  } catch (error) {
    console.error('Error deleting log:', error);
    res.status(500).json({ error: 'Failed to delete log' });
  }
});

export default router;