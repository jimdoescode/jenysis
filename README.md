Jenysis Javascript World Generator
==================================

This is a collection of javascript libraries that will let you generate a realistic world. The goal
of this project is to emulate the complex world generation of games like Dwarf Fortress including 
terrain, weather, temperature, biomes, civilizations and history. My hope is that upon completion of 
these goals I will continue developing this project into a game similar to the adventure mode of 
Dwarf Fortress.

Please note that this is the very very early stage of this project. Many things are not correct in terms of proper 
world generation. Please bare with me as I continue to work on and improve this project.


Instantiation
-------------

A new world is created by instantiating the World object and passing in a world size and water level.

var world = new World(257, 90);

World sizes should be (x^2)+1 as midpoint displacement is used to generate many of the features of 
the world.

Water level should be a value between 0-255.


To display the world on an HTML canvas element, you must instantiate the WorldRender object. Pass a 
handle to the canvas element you wish to render on as well as elevation values for beaches, forrest, 
and mountains. Elevation values should be between 0-255.

var renderer = new WorldRenderer(document.getElementById('map'), 105, 180, 240);

NOTE: Currently biome data is determined by elevation. This should be changed very soon, at which 
time you will no longer need to specify elevations for biome data.


Usage
-----

Once you have created your world object and rendering object now you can begin to generate your 
world. The following calls will create different aspects of the world.

You must always generate some terrain prior to any other operation.

world.createTerrain();

Once the initial terrain is created then you can perform other operations that affect the terrain. 

---------------------------------------------------------------------------------------------------

Erosion will cut paths through the terrain, starting at random points within the specified elevation 
percentage.

world.createErosion(0.15, 20); //Run 20 erosion paths starting in the top 15 percent of elevation

---------------------------------------------------------------------------------------------------

Rivers will behave similarly to erosion, except water will be set as the terrain type.

world.createRivers(0.2, 10); //Run 10 rivers start in the top 20 percent of elevation.

---------------------------------------------------------------------------------------------------

Temperatures can also be generated. They go from coldest at the top to warmest at the bottom.

world.createTemperatures();

---------------------------------------------------------------------------------------------------

After each call you can use the renderer to view the changes to the world.

renderer.drawTiled(world, 5); //Draw the world on the canvas each square should be 5 pixels.