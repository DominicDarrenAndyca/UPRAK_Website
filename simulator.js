document.addEventListener('DOMContentLoaded', function() {
    const dataWilayah = {
        "1. Aceh": [5.07, 150], "2. Sumatera Utara": [4.80, 500], "3. Sumatera Barat": [4.65, 200],
        "4. Riau": [4.80, 300], "5. Kepulauan Riau": [4.70, 180], "6. Jambi": [4.50, 150],
        "7. Sumatera Selatan": [4.85, 400], "8. Bangka Belitung": [4.90, 100], "9. Bengkulu": [4.60, 100],
        "10. Lampung": [5.00, 350], "11. DKI Jakarta": [4.80, 1500], "12. Jawa Barat": [4.50, 1200],
        "13. Banten": [4.60, 800], "14. Jawa Tengah": [4.95, 900], "15. DI Yogyakarta": [5.10, 250],
        "16. Jawa Timur": [5.25, 1100], "17. Bali": [5.30, 400], "18. NTB": [5.60, 150],
        "19. NTT": [5.80, 120], "20. Kalimantan Barat": [4.50, 200], "21. Kalimantan Tengah": [4.60, 180],
        "22. Kalimantan Selatan": [4.80, 250], "23. Kalimantan Timur": [4.70, 450], "24. Kalimantan Utara": [4.40, 80],
        "25. Sulawesi Utara": [5.10, 180], "26. Gorontalo": [5.20, 80], "27. Sulawesi Tengah": [5.00, 150],
        "28. Sulawesi Barat": [4.90, 70], "29. Sulawesi Selatan": [5.30, 550], "30. Sulawesi Tenggara": [5.10, 150],
        "31. Maluku": [5.20, 100], "32. Maluku Utara": [5.00, 80], "33. Papua": [4.80, 200], "34. Papua Barat": [4.70, 100]
    };

    const formatRp = (v) => "Rp " + Math.round(v).toLocaleString('id-ID');

    window.updateIrr = function(areaNum) {
        const selectedName = document.getElementById(`a${areaNum}Name`).value;
        const irrInput = document.getElementById(`a${areaNum}Irr`);
        const demInput = document.getElementById(`a${areaNum}Demand`);

        if (dataWilayah[selectedName]) {
            irrInput.value = dataWilayah[selectedName][0];
            demInput.value = dataWilayah[selectedName][1]; 
        } else {
            irrInput.value = 0;
            demInput.value = 0;
        }
        calculate();
    };

    window.calculate = function() {
        for (let i = 1; i <= 2; i++) {
            const irr = parseFloat(document.getElementById(`a${i}Irr`).value) || 0;
            const coalP = parseFloat(document.getElementById(`a${i}CoalPrice`).value) || 0;
            const dem = parseFloat(document.getElementById(`a${i}Demand`).value) || 0;
            const life = parseFloat(document.getElementById(`a${i}Life`).value) || 1;

            const s_initial = dem * 10000000000;
            const s_annual_opex = s_initial * 0.01;
            const s_energy_annual_mwh = (dem * irr * 365);
            const s_lcoe = (s_initial + (s_annual_opex * life)) / (s_energy_annual_mwh * life);

            const e_coal_annual_mwh = (dem * 8760) * 0.85;
            const c_initial = dem * 23000000000;
            const c_fuel_annual = (e_coal_annual_mwh * 0.4) * coalP;
            const c_maintenance_annual = e_coal_annual_mwh * 450000;
            const c_annual_opex = c_fuel_annual + c_maintenance_annual;
            const c_lcoe = (c_initial + (c_annual_opex * life)) / (e_coal_annual_mwh * life);

            document.getElementById(`a${i}S_Initial`).innerText = formatRp(s_initial);
            document.getElementById(`a${i}S_Monthly`).innerText = formatRp(s_annual_opex) + " /tahun";
            document.getElementById(`a${i}S_MWh`).innerText = formatRp(s_lcoe) + " /MWh";

            document.getElementById(`a${i}C_Initial`).innerText = formatRp(c_initial);
            document.getElementById(`a${i}C_Monthly`).innerText = formatRp(c_annual_opex) + " /tahun";
            document.getElementById(`a${i}C_MWh`).innerText = formatRp(c_lcoe) + " /MWh";

            const winMsg = document.getElementById(`a${i}WinMsg`);
            if (irr === 0 || dem === 0) {
                winMsg.innerText = "-";
            } else {
                const diff = Math.abs(((c_lcoe - s_lcoe) / c_lcoe * 100)).toFixed(1);
                winMsg.innerText = s_lcoe < c_lcoe ? 
                    `☀️ Surya ${diff}% lebih murah` : 
                    `🌑 Batu Bara ${diff}% lebih murah`;
            }
        }
    };

    document.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', calculate);
    });

    calculate();
});