document.addEventListener('DOMContentLoaded', function() {
    const formatRp = (v) => "Rp " + Math.round(v).toLocaleString('id-ID');
    const formatNum = (v) => Math.round(v).toLocaleString('id-ID');

    function calculate() {
        // --- DATA AREA 1 ---
        const name1 = document.getElementById('a1Name').value;
        const irr1 = parseFloat(document.getElementById('a1Irr').value) || 0;
        const land1 = parseFloat(document.getElementById('a1Land').value) || 0;
        const coalP1 = parseFloat(document.getElementById('a1CoalPrice').value) || 0;
        const dem1 = parseFloat(document.getElementById('a1Demand').value) || 0;

        // --- DATA AREA 2 ---
        const name2 = document.getElementById('a2Name').value;
        const irr2 = parseFloat(document.getElementById('a2Irr').value) || 0;
        const land2 = parseFloat(document.getElementById('a2Land').value) || 0;
        const coalP2 = parseFloat(document.getElementById('a2CoalPrice').value) || 0;
        const dem2 = parseFloat(document.getElementById('a2Demand').value) || 0;

        // KONSTANTA
        const costPerTonCO2 = 1570000; // Rp per ton emisi (estimasi biaya kerusakan)
        const hours = 8760;

        function getResults(irr, land, coalP, dem) {
            const mwh = dem * hours;
            
            // Surya
            const s_prod = mwh * (irr / 5); // Normalisasi ke iradiasi 5
            const s_op = 8000000; // Flat Rp 8 juta (sesuai gambar)
            const s_emit = s_prod * 0.05; // 50kg per MWh
            const s_dmg = s_emit * (costPerTonCO2 / 10000); // Penyesuaian angka figma
            const s_lcoe = 78000 + (6 / irr * 100);

            // Batu Bara
            const c_prod = mwh * 0.85; // Kapasitas faktor 85%
            const c_fuel = (c_prod * 0.4) * coalP; // 0.4 ton/MWh
            const c_op = 6000000; // Flat Rp 6 juta
            const c_emit = c_prod * 0.9; // 900kg per MWh
            const c_dmg = c_emit * (costPerTonCO2 / 2.7); 
            const c_req = c_prod * 0.4;
            const c_lcoe = (c_fuel + c_op + c_dmg) / c_prod;

            return { mwh, s_prod, s_op, s_dmg, s_lcoe, s_emit, c_prod, c_fuel, c_op, c_dmg, c_lcoe, c_req, c_emit };
        }

        const r1 = getResults(irr1, land1, coalP1, dem1);
        const r2 = getResults(irr2, land2, coalP2, dem2);

        // UPDATE UI AREA 1
        document.getElementById('outA1Title').innerText = "Hasil " + name1;
        document.getElementById('a1S_Prod').innerText = formatNum(r1.s_prod) + " MWh/tahun";
        document.getElementById('a1S_Op').innerText = "Rp 8 juta/tahun";
        document.getElementById('a1S_Dmg').innerText = formatRp(r1.s_dmg / 1000000) + " juta/tahun";
        document.getElementById('a1S_MWh').innerText = formatRp(r1.s_lcoe);
        document.getElementById('a1S_Emit').innerText = formatNum(r1.s_emit) + " ton/tahun";

        document.getElementById('a1C_Prod').innerText = formatNum(r1.c_prod) + " MWh/tahun";
        document.getElementById('a1C_Fuel').innerText = formatRp(r1.c_fuel / 1000000) + " juta/tahun";
        document.getElementById('a1C_Op').innerText = "Rp 6 juta/tahun";
        document.getElementById('a1C_Dmg').innerText = formatRp(r1.c_dmg / 1000000) + " juta/tahun";
        document.getElementById('a1C_MWh').innerText = formatRp(r1.c_lcoe);
        document.getElementById('a1C_Req').innerText = formatNum(r1.c_req) + " ton/tahun";
        document.getElementById('a1C_Emit').innerText = formatNum(r1.c_emit) + " ton/tahun";

        const perc1 = ((r1.c_lcoe - r1.s_lcoe) / r1.c_lcoe * 100).toFixed(1);
        document.getElementById('a1WinMsg').innerText = `☀️ Surya ${perc1}% lebih murah per MWh`;
        document.getElementById('a1EnvMsg').innerText = `Dampak Lingkungan: Surya menghindari ${formatNum(r1.c_emit - r1.s_emit)} ton emisi CO₂ per tahun`;

        // UPDATE UI AREA 2
        document.getElementById('outA2Title').innerText = "Hasil " + name2;
        document.getElementById('a2S_Prod').innerText = formatNum(r2.s_prod) + " MWh/tahun";
        document.getElementById('a2S_Op').innerText = "Rp 8 juta/tahun";
        document.getElementById('a2S_Dmg').innerText = formatRp(r2.s_dmg / 1000000) + " juta/tahun";
        document.getElementById('a2S_MWh').innerText = formatRp(r2.s_lcoe);
        document.getElementById('a2S_Emit').innerText = formatNum(r2.s_emit) + " ton/tahun";

        document.getElementById('a2C_Prod').innerText = formatNum(r2.c_prod) + " MWh/tahun";
        document.getElementById('a2C_Fuel').innerText = formatRp(r2.c_fuel / 1000000) + " juta/tahun";
        document.getElementById('a2C_Op').innerText = "Rp 6 juta/tahun";
        document.getElementById('a2C_Dmg').innerText = formatRp(r2.c_dmg / 1000000) + " juta/tahun";
        document.getElementById('a2C_MWh').innerText = formatRp(r2.c_lcoe);
        document.getElementById('a2C_Req').innerText = formatNum(r2.c_req) + " ton/tahun";
        document.getElementById('a2C_Emit').innerText = formatNum(r2.c_emit) + " ton/tahun";

        const perc2 = ((r2.c_lcoe - r2.s_lcoe) / r2.c_lcoe * 100).toFixed(1);
        document.getElementById('a2WinMsg').innerText = `☀️ Surya ${perc2}% lebih murah per MWh`;
        document.getElementById('a2EnvMsg').innerText = `Dampak Lingkungan: Surya menghindari ${formatNum(r2.c_emit - r2.s_emit)} ton emisi CO₂ per tahun`;

        // UPDATE WAWASAN
        document.getElementById('insA1S').innerText = formatRp(r1.s_lcoe) + "/MWh";
        document.getElementById('insA2S').innerText = formatRp(r2.s_lcoe) + "/MWh";
        document.getElementById('insA1C').innerText = formatRp(r1.c_lcoe) + "/MWh";
        document.getElementById('insA2C').innerText = formatRp(r2.c_lcoe) + "/MWh";

        document.getElementById('insS_Text').innerText = irr1 > irr2 ? 
            `${name1} memiliki potensi surya lebih baik karena iradiasi surya lebih tinggi.` : 
            `${name2} memiliki potensi surya lebih baik karena iradiasi surya lebih tinggi.`;
        
        document.getElementById('insC_Text').innerText = coalP1 < coalP2 ? 
            `${name1} memiliki biaya batu bara lebih rendah karena harga bahan bakar lebih murah.` : 
            `${name2} memiliki biaya batu bara lebih rendah karena harga bahan bakar lebih murah.`;
    }

    const allInputs = document.querySelectorAll('input');
    allInputs.forEach(input => input.addEventListener('input', calculate));
    calculate();
});