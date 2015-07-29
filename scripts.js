'use scrict';

(function startSorting() {
    /*
     * Start sorting
     *
     * Gets an array of hex codes to be sorted
     */
    $('.btn-primary').on('click', function(e) {
        e.preventDefault();

        var $tilesContainer = $('.tiles'),
            $toggleDetails = $('<button class="btn btn-default">Toggle details</button>'),
            $lines = $('textarea').val().split(/\n/),
            unsortedArrayOfColorObjects = [];

        for (var i=0; i < $lines.length; i++) {
          // only push this line if it contains a non whitespace character.
          if (/\S/.test($lines[i])) {
              unsortedArrayOfColorObjects.push({
                  hex: $.trim($lines[i])
              });
          }
        }

        var sortedArrayOfColorObjects = sortColors(unsortedArrayOfColorObjects);

        // Empty first
        $tilesContainer.empty();

        $.each(sortedArrayOfColorObjects, function(index, value) {
            var red = hexToRgb(value.hex).r,
                green = hexToRgb(value.hex).g,
                blue = hexToRgb(value.hex).b,
                tile = '<li class="tile" style="background-color:' + value.hex + ';">' +
                           '<div class="tile-details">' +
                               '<p class="tile-hex">Hex: <code>' + value.hex + '</code></p>' +
                               '<p class="tile-rgb">RGB: <code class="red">' + red + '</code> <code class="green">' + green + '</code> <code class="blue">' + blue + '</code></p>' +
                           '<div>' +
                       '</li>';

            $tilesContainer.append(tile);

            // Make the tiles sortable manually
            $tilesContainer.sortable();
            $tilesContainer.disableSelection();
        });

        // Update button text
        $(this).text('Update...');

        if($('.btn-default').length === 0) {
            $(this).after($toggleDetails);
        }

        $toggleDetails.on('click', function(e) {
            e.preventDefault();

            $tilesContainer.toggleClass('tile-details-visible');
        });
    });
})();

function sortColors(colors) {
    /*
     * Sort colors
     *
     * Sort array of hex colors by hue
     *
     * Based on http://www.runtime-era.com/2011/11/grouping-html-hex-colors-by-hue-in.html
     */
    for (var c = 0; c < colors.length; c++) {
        /* Get the hex value without hash symbol. */
        var hex = colors[c].hex.substring(1);

        /* Get the RGB values to calculate the Hue. */
        var r = parseInt(hex.substring(0,2),16)/255;
        var g = parseInt(hex.substring(2,4),16)/255;
        var b = parseInt(hex.substring(4,6),16)/255;

        /* Getting the Max and Min values for Chroma. */
        var max = Math.max.apply(Math, [r,g,b]);
        var min = Math.min.apply(Math, [r,g,b]);

        /* Variables for HSV value of hex color. */
        var chr = max-min;
        var hue = 0;
        var val = max;
        var sat = 0;

        if (val > 0) {
            /* Calculate Saturation only if Value isn't 0. */
            sat = chr/val;
            if (sat > 0) {
                if (r == max) { 
                    hue = 60*(((g-min)-(b-min))/chr);
                    if (hue < 0) {hue += 360;}
                } else if (g == max) { 
                    hue = 120+60*(((b-min)-(r-min))/chr); 
                } else if (b == max) { 
                    hue = 240+60*(((r-min)-(g-min))/chr); 
                }
            }
        }

        /* Modifies existing objects by adding HSV values. */
        colors[c].hue = hue;
        colors[c].sat = sat;
        colors[c].val = val;
    }

    /* Sort by Hue. */
    return colors.sort(function(a,b){return a.hue - b.hue;});
}

function hexToRgb(hex) {
    /*
     * Hex to RGB
     *
     * Convert hex to rgb
     *
     * http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
     */
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
