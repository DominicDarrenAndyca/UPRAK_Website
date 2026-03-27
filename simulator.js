document.addEventListener('DOMContentLoaded', function() {
    // Fungsi pembantu untuk format angka
    const formatRp = (v) => "Rp " + Math.round(v).toLocaleString('id-ID');
    const formatNum = (v) => Math.round(v).toLocaleString('id-ID');

    function calculate() {
        // --- AMBIL DATA DARI INPUT ---
        const name1 = document.getElementById('a1Name').value || "Area 1";
        const irr1 = parseFloat(document.getElementById('a1Irr').value) || 0;
        const coalP1 = parseFloat(document.getElementById('a1CoalPrice').value) || 0;
        const dem1 = parseFloat(document.getElementById('a1Demand').value) || 0;

        const name2 = document.getElementById('a2Name').value || "Area 2";
        const irr2 = parseFloat(document.getElementById('a2Irr').value) || 0;
        const coalP2 = parseFloat(document.getElementById('a2CoalPrice').value) || 0;
        const dem2 = parseFloat(document.getElementById('a2Demand').value) || 0;

        const hours = 8760; // Jam dalam setahun

        // --- FUNGSI LOGIKA PERHITUNGAN ---
        function getResults(irr, coalP, dem) {
            const mwhTotal = dem * hours;
            
            // 1. Perhitungan Surya
            const s_prod = mwhTotal * (irr / 5); 
            const s_op = 8000000; // Biaya Operasi Tetap Rp 8 Juta
            // Rumus LCOE Surya (Semakin tinggi iradiasi, semakin murah)
            const s_lcoe = 78000 + (600 / (irr || 1) * 100);

            // 2. Perhitungan Batu Bara
            const c_prod = mwhTotal * 0.85; // Efisiensi pembakaran
            const c_req = c_prod * 0.4;     // Konsumsi 0.4 ton per MWh
            const c_fuel = c_req * coalP;   // Total biaya bahan bakar
            const c_lcoe = (c_fuel + 6000000) / (c_prod || 1); // Biaya bahan bakar + ops / produksi

            return { s_prod, s_op, s_lcoe, c_prod, c_fuel, c_req, c_lcoe };
        }

        const r1 = getResults(irr1, coalP1, dem1);
        const r2 = getResults(irr2, coalP2, dem2);

        // --- UPDATE UI AREA 1 ---
        // Judul Area
        const title1 = document.getElementById('outA1Title text-slate-800'); // Sesuai ID di HTML kamu yang agak unik
        if(title1) title1.innerText = "Hasil " + name1;

        document.getElementById('a1S_Prod').innerText = formatNum(r1.s_prod) + " MWh/tahun";
        document.getElementById('a1S_Op').innerText = formatRp(r1.s_op) + "/tahun";
        document.getElementById('a1S_MWh').innerText = formatRp(r1.s_lcoe);

        document.getElementById('a1C_Prod').innerText = formatNum(r1.c_prod) + " MWh/tahun";
        document.getElementById('a1C_Fuel').innerText = formatRp(r1.c_fuel);
        document.getElementById('a1C_MWh').innerText = formatRp(r1.c_lcoe);
        document.getElementById('a1C_Req').innerText = formatNum(r1.c_req) + " ton/tahun";

        // Pesan Pemenang Area 1
        const perc1 = Math.abs(((r1.c_lcoe - r1.s_lcoe) / r1.c_lcoe * 100)).toFixed(1);
        document.getElementById('a1WinMsg').innerText = r1.s_lcoe < r1.c_lcoe ? 
            `☀️ Surya ${perc1}% lebih murah per MWh` : 
            `🌑 Batu Bara ${perc1}% lebih murah per MWh`;

        // --- UPDATE UI AREA 2 ---
        // Update Judul Area 2 (Cari elemen h2 yang isinya "Hasil Area 2")
        const h2Elements = document.getElementsByTagName('h2');
        for (let h2 of h2Elements) {
            if (h2.innerText.includes("Hasil Area 2")) h2.innerText = "Hasil " + name2;
        }

        document.getElementById('a2S_Prod').innerText = formatNum(r2.s_prod) + " MWh/tahun";
        document.getElementById('a2S_Op').innerText = formatRp(r2.s_op) + "/tahun";
        document.getElementById('a2S_MWh').innerText = formatRp(r2.s_lcoe);

        document.getElementById('a2C_Prod').innerText = formatNum(r2.c_prod) + " MWh/tahun";
        document.getElementById('a2C_Fuel').innerText = formatRp(r2.c_fuel);
        document.getElementById('a2C_MWh').innerText = formatRp(r2.c_lcoe);
        document.getElementById('a2C_Req').innerText = formatNum(r2.c_req) + " ton/tahun";

        // Pesan Pemenang Area 2
        const perc2 = Math.abs(((r2.c_lcoe - r2.s_lcoe) / r2.c_lcoe * 100)).toFixed(1);
        document.getElementById('a2WinMsg').innerText = r2.s_lcoe < r2.c_lcoe ? 
            `☀️ Surya ${perc2}% lebih murah per MWh` : 
            `🌑 Batu Bara ${perc2}% lebih murah per MWh`;
    }

    // Pasang Event Listener ke semua input agar otomatis update saat diketik
    const allInputs = document.querySelectorAll('input');
    allInputs.forEach(input => {
        input.addEventListener('input', calculate);
    });

    // Jalankan kalkulasi pertama kali saat halaman dibuka
    calculate();
});