# pixelartHelpers
small scripts and tools to help with my pixelart projects

## SimpleFontChecker
This is a small and simple JavaScript Tool to check how a bitmap font looks "in real" with one char next to each other.
It doesn´t generate real words, this is just a random mapping of chars - to see maybe some drawing issues. 
And some programmers always tend do have their own love for which orders chars in font should be - so no need to give a char order to keep this test as simple n flexible possible ;).

So this loads a img with the bitmap font - (in this example just font.png) and checks for 5 
variables in the script.js file:
```
canvas.width = 1024; //size x preview
canvas.height = 1024; //size y preview
const gridW = 16, //x font width
      gridH = 16, //y font heigth
      ignoreChars = [0,3,4,5,6,7,10,15,28,30,32,59] //just the plain tile number of the chars 
                    //to ignore, keep that array empty if you don´t want to skip any
      ;
```

And yes, the font was pixeled by me. 