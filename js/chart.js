document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const content = document.getElementById('content');

    // Tampilkan animasi loading saat halaman dimuat
    loadingOverlay.style.display = 'flex'; // Tampilkan overlay


    let data = [];
    fetch('http://localhost:1000/data')
        .then(response => response.json())
        .then(fetchedData => {
            loadingOverlay.style.display = 'none'; // Sembunyikan overlay
            content.style.display = 'block'; // Tampilkan konten utama
            data = fetchedData; // Simpan data yang diambil dari server
            // Buat chart setelah data tersedia
            createChart(countDataByMonthAndYear(data));

            // Sembunyikan animasi loading setelah data selesai dimuat
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            loadingOverlay.style.display = 'none';
        });

    //fungsi membuat nama bulan
    function getMonthName(monthNumber) {
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return months[monthNumber - 1]; // Bulan dimulai dari indeks 0
    }

    // Fungsi untuk menghitung jumlah data dengan bulan dan tahun yang sama
    function countDataByMonthAndYear(data) {
        const countsale = {};
        data.forEach(item => {
            if (item.SALEDATE) {
                const saleDate = item.SALEDATE.split(' ')[0]; // Ambil bagian tanggal saja (yyyy-mm-dd)
                const [year, month] = saleDate.split('-'); // Pisahkan tahun dan bulan
                const monthName = getMonthName(parseInt(month)); // Dapatkan nama bulan dari angka bulan
                const key = `${monthName} ${year}`; // Gabungkan bulan dan tahun sebagai kunci
                countsale[key] = (countsale[key] || 0) + 1; // Tambahkan jumlah data dengan kunci yang sama
            } else {
                console.warn('Invalid SALEDATE format:', item.SALEDATE);
            }
        });
        return countsale;
    }

    // Fungsi untuk membuat chart
    function createChart(countsale) {
        const line_1 = document.getElementById("line_1").getContext('2d');
        const labels = Object.keys(countsale); // Ambil kunci dari objek countsale sebagai label
        const dataValues = Object.values(countsale); // Ambil nilai dari objek countsale sebagai data

        const Chart_1 = new Chart(line_1, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Data Penjualan',
                    data: dataValues,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                }]
            }
        });
    }
});
