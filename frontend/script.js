let stockChart; // Global chart variable to keep track of the chart instance

document.getElementById("stockForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const ticker = document.getElementById("ticker").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    fetch(`https://stock-dashboard-1-91fa.onrender.com/get_stock_data?ticker=${ticker}&startDate=${startDate}&endDate=${endDate}`)
        .then(response => response.json())
        .then(data => {
            addStockDataToGraph(data); // Call the function to add data to the chart
        })
        .catch(error => console.error('Error fetching stock data:', error));
});

function addStockDataToGraph(stockData) {
    const ctx = document.getElementById('stockGraph').getContext('2d');

    if (!stockChart) {
        stockChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: stockData.dates,
                datasets: []
            },
            options: {
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 0,
                            minRotation: 0,
                            font: {
                                size: 10
                            }
                        }
                    },
                    y: {
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    // Add the new dataset for the current stock
    const newDataset = {
        label: stockData.ticker,
        data: stockData.prices,
        borderColor: getRandomColor(),
        backgroundColor: 'rgba(111, 66, 193, 0.1)'
    };

    stockChart.data.datasets.push(newDataset);
    stockChart.update(); // Update the chart to display the new data
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

document.getElementById("emailForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;

    const chartCanvas = document.getElementById('stockGraph');
    const chartImage = chartCanvas.toDataURL('image/png');
    
    fetch('https://stock-dashboard-1-91fa.onrender.com/send_email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            chartImage: chartImage
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => console.error('Error sending email:', error));
});
