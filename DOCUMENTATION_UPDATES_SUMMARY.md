# Documentation Updates Summary

This document summarizes all the updates made to the Pict'Oh project documentation based on the new requirements.

## Files Updated

1. **AGENTS.md** - AI Agent prompt with technical specifications
2. **plan.md** - Detailed implementation plan
3. **README.md** - Project overview

---

## Key Changes

### 1. Image Caching Strategy

**Before:**
- Images loaded on first access
- Runtime caching for pictures

**After:**
- **All images** from the library are cached on first load
- When a user adds a new image to a square, it is **immediately added to the cache**
- Ensures complete offline availability

### 2. Touch Interaction Behavior

**Before:**
- Clicking a square triggers TTS

**After:**
- **Touch (on touch start, not on release)** triggers TTS
- Square border **changes color for 1 second** as visual feedback
- More responsive and tablet-friendly

### 3. Edit Mode Visual Feedback

**Before:**
- Generic borders around squares in edit mode

**After:**
- **All squares display red borders** when edit mode is active
- Clear visual indicator that edit mode is enabled

### 4. Page Management System

**Before:**
- Pages identified by `pageName`
- Renaming pages required updating all references

**After:**
- Pages use unique **`pageId`** as the key
- `pageName` is just the display name
- Page renaming no longer breaks references
- **Pages dialog sorts pages by name alphabetically**

### 5. Picture Management System

**Before:**
- Favorites system (pictures become favorite on first use)
- Show favorites by default
- Display favorite count

**After:**
- **Max 50 pictures displayed** at once
- Pictures tracked by **`lastUsedTime`** attribute
- New pictures replace the **last used** picture
- **No favorite count displayed**
- **No Google** integration
- Library will eventually contain **thousands of images**

### 6. Image Library Management

**Before:**
- Manual picture manifest/index file

**After:**
- **Preferred approach**: Auto-discover images from `/public/assets/pictures/*` directory
  - No manual list maintenance required
- **Fallback approach**: Create a script to generate image list
  - Script updates manifest when new images are added

### 7. User-Added Pictures

**New feature added:**
- Users can add their own pictures (not from the built-in library)
- User-added pictures are:
  - Stored separately from built-in library
  - Cached immediately for offline use
  - Tracked with `lastUsedTime`
  - Included in the 50-picture display limit
- Picture selection dialog provides:
  - **Filter toggle**: Built-in, User-added, or Both
  - **Search functionality** across all pictures

### 8. Save Indicator

**Before:**
- Optional save status indicator

**After:**
- Show a **discrete save indicator** when saving
- Brief, non-intrusive visual feedback
- Fades out after 1-2 seconds

### 9. Import/Export

**Before:**
- Optional enhancement planned

**After:**
- **Not implemented yet** - reserved for future feature
- Removed from current scope

### 10. Test Images

**Before:**
- Documentation stated test pictures would be created

**After:**
- **Repository currently has no test images**
- Will be added in the future
- Note: Library will eventually contain thousands of images

---

## Updated Data Models

### Page Interface
```typescript
interface Page {
  pageId: string;        // NEW: Unique identifier
  pageName: string;      // Display name (can be changed)
  squares: Square[];     // 24 squares (6×4 grid)
}
```

### Square Interface
```typescript
interface Square {
  selectedPicture?: Picture;
  associatedText: string;
  displayTextAbovePicture: boolean;
  openPageId: string;    // CHANGED: References page by ID (not name)
}
```

### Picture Interface
```typescript
interface Picture {
  id: string;
  path: string;
  text: string;          // Default: filename
  lastUsedTime: number;  // NEW: Track usage for 50-picture limit
  isUserAdded: boolean;  // NEW: Distinguish built-in vs user-added
}
```

### App Config
```typescript
interface AppConfig {
  homePageId: string;    // CHANGED: Reference by ID
  currentPageId: string; // CHANGED: Reference by ID
  pages: Page[];
}
```

---

## Architecture Updates

### New Decisions

11. **Page References**: Use unique `pageId` instead of `pageName` to handle renames
12. **Picture Limit**: Maximum 50 pictures displayed, sorted by `lastUsedTime`
13. **Picture Discovery**: Auto-discover images from directory (preferred) or use generation script
14. **User Pictures**: Support user-added pictures with same caching/tracking as built-in

### Updated Performance Targets

- Square Touch Response: Immediate visual feedback (border color change for 1 second)
- Picture Search: < 100ms for filtering (even with thousands of images)
- Save Indicator: Discrete, fades within 1-2 seconds

---

## Epic Updates Summary

### Epic 2: Core Data Models & State Management
- Add `pageId` to Page interface
- Add `lastUsedTime` to Picture interface
- Use `homePageId` and `currentPageId` instead of names
- Track picture usage instead of favorites

### Epic 3: Offline-First Architecture
- Complete image library caching on first load
- Immediate caching when user adds images to squares

### Epic 5: Square Interaction & TTS Integration
- Trigger on touch start (not release)
- Border color change for 1 second

### Epic 6: Edit Mode & Configuration
- Red borders on all squares in edit mode
- Pages dialog sorts by name

### Epic 7: Page Management System
- Generate unique `pageId` for each page
- Navigate/reference by ID, not name
- Renaming no longer requires updating references

### Epic 8: Picture Management & Selection
- Auto-discovery of images (preferred)
- Max 50 pictures, tracked by `lastUsedTime`
- User-added pictures support
- Filter toggle (built-in/user-added)
- Search functionality
- No favorite count

### Epic 9: Persistence & Storage
- Discrete save indicator
- Import/export not implemented yet

---

## Implementation Notes

### Critical Changes

1. **Breaking change**: Page references must migrate from name-based to ID-based
2. **Breaking change**: Favorites system replaced with `lastUsedTime` tracking
3. **New feature**: User-added pictures support requires upload functionality
4. **Performance**: Must handle thousands of images efficiently with search/filter

### Future Considerations

- Import/export functionality (not in current scope)
- Library will grow to thousands of images
- Auto-discovery mechanism needs to be efficient
- 50-picture limit requires smart usage tracking

---

## Checklist for Implementation

When implementing these changes:

- [ ] Generate unique IDs for all pages (UUID or timestamp-based)
- [ ] Update all page references to use `pageId` instead of `pageName`
- [ ] Implement `lastUsedTime` tracking for pictures
- [ ] Remove favorites system, implement 50-picture limit
- [ ] Add user picture upload functionality
- [ ] Implement filter toggle (built-in/user-added)
- [ ] Implement search across all pictures
- [ ] Change touch handler from click to touchstart
- [ ] Add 1-second border color animation
- [ ] Add red border styling for edit mode
- [ ] Implement discrete save indicator
- [ ] Sort pages by name in manage pages dialog
- [ ] Implement image auto-discovery or generation script
- [ ] Update cache strategy to include all images on first load
- [ ] Cache user-added images immediately

---

**Document created**: 2026-02-02  
**Last updated**: 2026-02-02
