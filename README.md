# Javascript-Game-Generation
Using Javascript to create Procedural Generatiion

## Use

Include the js file at the bottom of the document.
```html
<html>
...
<script src="Tayssets.js"></script>
</html>
```

### Rendering

This tool contains a Renderer object that can render all of the provided algorithms.
Intructions on how to use will be included with each section of the generators.

### Dungeon Generation

`Dungeon.Generate()` will take 5 parameters.

- minRoomSize: The smallest possible size (in Pixels) of a room
- maxRoomSize: The largest possible size (in Pixels) of a room
- minRooms: The minimum number of rooms to be generated
- maxRooms: The maximum number of rooms to be generated
- mapSize: This will be the size of the grid. *Too small of a grid with too high of rooms could break the dungeon.*

#### Example
```javascript
Dungeon.Generate(5, 15, 30, 40, 128);
```

#### Rendering
To render the dungeon you must first initialize the dungeon to the canvas

```javascript
Renderer.InitializeDungeon('map', Dungeon);
```
Dungeon is the name of the variable in the script. If you set Dungeon to a new variable then be sure to use your new variable. If not then dont change the name.

After the dungeon has been initialized on the cnavas we can call the UpdateDungeon method to render the tiles.

```javascript
Renderer.UpdateDungeon('#000', '#5d5d5d', '#fff', Dungeon);
```

This method takes in four parameters; The Background color, the wall color, the floor color, and the dungeon itself.

##### Rendered looks like this

![alt text](http://i.imgur.com/vVlZw52.png "Rendered 2D Dungeon")

### Mountain Generation

`MountainGeneration.Generate()` will take 4 parameters.

- width: width of mountain box
- height: height of mountain box
- displacement: how high the mountains generate
- roughness: How rugged or smooth the mountains are

#### Example
```javascript
var mountains = [];

var width = 1920;
var height = 1000;

mountains.push(MountainGeneration.Generate(width, height, height / 3, .5));
mountains.push(MountainGeneration.Generate(width, height, height / 2, .5));
```
For the example of multiple mountains, generate multiple and place them in an array.

#### Rendering
To render the mountain you must first initialize the mountains in an array. The renderer will take in the array and render the mountains in order.
You must also first initialize the canvas of which to render the mountains.

```javascript
Renderer.InitializeMountain('map', width, height);
```

After the canvas has been initialized you can call the render method for the mounstains.

```javascript
Renderer.UpdateMountain(mountains);
```

Just pass in the array of mountains and it will pick random colors to render them with.

