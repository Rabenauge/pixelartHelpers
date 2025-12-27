# pixelartHelpers
small scripts and tools to help with my pixelart projects

## SimpleFontChecker

### Small Update 27.12.2025

Still a simple JavaScript Tool to check how a "bitmap font" looks "in real" with one char next to each other. 
Shown on block or in scrollers, now.  
Added a few Options that have been before just variables as input fields in the html. 
Also added a few more properties like margin (around all tiles) and gap (around each tile)

It doesn´t generate real words, this is just a random mapping of chars - to see maybe some drawing issues. 
And some programmers always tend do have their own love for which orders chars in font should be - so no need to give a char order to keep this test as simple n flexible possible ;).
So this loads a img with the bitmap font - (in this example just font.png). For the latest version all variables are now adjustable over input fields. - it also saves settings for a font - as a file AND in the LocalStorage.

And yes, the font in the repository was pixeled by me.  I recommend trying it out with other fonts like:  https://github.com/ianhan/BitmapFonts/