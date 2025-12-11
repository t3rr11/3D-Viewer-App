# 3D Viewer App - New Features

## Model Rotation Controls

You can now rotate any model using the sliders in the Controls panel:

- **X Rotation**: Rotate around the X-axis (-180° to 180°)
- **Y Rotation**: Rotate around the Y-axis (-180° to 180°)  
- **Z Rotation**: Rotate around the Z-axis (-180° to 180°)

The rotation applies to the entire model or all parts in a multi-part model.

## Multi-Part Model Interaction

### Transform Controls (Move & Rotate Parts)

When you have a multi-part model loaded:

1. **Select a Part**: Click on any part to select it (it will highlight in cyan)
2. **Multi-Select**: Hold `Ctrl` (or `Cmd` on Mac) and click to select multiple parts
3. **Transform Mode**:
   - Press `G` to switch to **Move mode** (translate)
   - Press `R` to switch to **Rotate mode**
4. **Use the Gizmo**: Drag the transform gizmo handles to move or rotate the selected part(s)

### Visual Feedback

- **Selected parts**: Highlighted in cyan color with glow effect
- **Unselected parts**: Become semi-transparent when other parts are selected
- **Transform gizmo**: Appears on the first selected part with color-coded axes (red=X, green=Y, blue=Z)

### Mouse Controls

- **Left Click**: Select a part
- **Ctrl + Left Click**: Add/remove parts from selection
- **Left Drag**: Rotate camera view
- **Right Drag**: Pan camera
- **Scroll Wheel**: Zoom in/out
- **Background Click**: Deselect all parts

## Tips

- Use the **Reset View** button to reset camera position and all rotations
- Toggle **Auto Rotate** to automatically spin the model
- Use **Show Grid** to display or hide the floor grid
- The transform controls work best with individual parts - select one at a time for precise positioning
