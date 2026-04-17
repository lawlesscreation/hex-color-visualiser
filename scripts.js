'use strict';

(function startVisualiser() {
    var arrayOfColorObjects = [];
    var $tilesContainer = $('.tiles');
    var $sortingControls = $('.sorting-controls');

    /*
     * Start visualiser
     *
     * Gets an array of hex codes to be displayed
     */
    $('.btn-primary').on('click', function(e) {
        e.preventDefault();

        var $lines = $('textarea').val().split(/\n/),
            $toggleDetails = $('<button class="btn btn-default">Toggle details</button>');

        arrayOfColorObjects = [];

        for (var i = 0; i < $lines.length; i++) {
            var hex = $.trim($lines[i]);
            // only push this line if it contains a non whitespace character.
            if (/\S/.test(hex)) {
                var rgb = hexToRgb(hex);
                if (rgb) {
                    var hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
                    arrayOfColorObjects.push({
                        hex: hex,
                        index: i,
                        hue: hsv.h,
                        sat: hsv.s,
                        val: hsv.v,
                        rgb: rgb
                    });
                }
            }
        }

        renderTiles(arrayOfColorObjects);
        $sortingControls.show();

        // Update button text
        $(this).text('Update...');

        if($('.btn-default-toggle').length === 0) {
            $toggleDetails.addClass('btn-default-toggle');
            $(this).after($toggleDetails);
        }

        $toggleDetails.on('click', function(e) {
            e.preventDefault();
            $tilesContainer.toggleClass('tile-details-visible');
        });
    });

    /*
     * Sorting event handlers
     */
    $sortingControls.on('click', 'button', function() {
        var strategy = $(this).data('sort');
        sortAndRender(strategy);
    });

    function sortAndRender(strategy) {
        var sorted = arrayOfColorObjects.slice();

        switch (strategy) {
            case 'hue':
                sorted.sort(function(a, b) { return a.hue - b.hue; });
                break;
            case 'sat':
                sorted.sort(function(a, b) { return a.sat - b.sat; });
                break;
            case 'val':
                sorted.sort(function(a, b) { return a.val - b.val; });
                break;
            case 'input':
            default:
                sorted.sort(function(a, b) { return a.index - b.index; });
                break;
        }

        renderTiles(sorted);
    }

    function renderTiles(colors) {
        $tilesContainer.empty();

        $.each(colors, function(index, value) {
            var red = value.rgb.r,
                green = value.rgb.g,
                blue = value.rgb.b,
                tile = '<li class="tile" style="background-color:' + value.hex + ';">' +
                           '<div class="tile-details">' +
                               '<p class="tile-hex">Hex: <code>' + value.hex + '</code></p>' +
                               '<p class="tile-rgb">RGB: <code class="red">' + red + '</code> <code class="green">' + green + '</code> <code class="blue">' + blue + '</code></p>' +
                           '</div>' +
                       '</li>';

            $tilesContainer.append(tile);
        });

        // Make the tiles sortable manually
        $tilesContainer.sortable();
        $tilesContainer.disableSelection();
    }
})();

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

function rgbToHsv(r, g, b) {
    /*
     * RGB to HSV
     * Based on http://www.runtime-era.com/2011/11/grouping-html-hex-colors-by-hue-in.html
     */
    r /= 255;
    g /= 255;
    b /= 255;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var chr = max - min;
    var hue = 0;
    var val = max;
    var sat = 0;

    if (val > 0) {
        sat = chr / val;
        if (sat > 0) {
            if (r === max) {
                hue = 60 * (((g - min) - (b - min)) / chr);
                if (hue < 0) { hue += 360; }
            } else if (g === max) {
                hue = 120 + 60 * (((b - min) - (r - min)) / chr);
            } else if (b === max) {
                hue = 240 + 60 * (((r - min) - (g - min)) / chr);
            }
        }
    }

    return { h: hue, s: sat, v: val };
}
