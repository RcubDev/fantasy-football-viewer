export default function GetToolTipPointsFor() {
    toolTips = {
        // Disable the on-canvas tooltip
        callbacks: {
            label: function(toolTipItems, data) {
                return data.datasets[tooltipItems.datasetIndex].label +': ' + tooltipItems.yLabel + ' €';
            }
        }
    }
}