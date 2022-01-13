//selectors and variables
let totalAyah = 114;
let highSpeed_init_percent = 40;
let highSpeed_init = 250;
let minHeighSPD = 50;
let getInterVal = 150 + minHeighSPD;
let isInc = 0;
let isInc_1 = 0;
let glob_i = 0;
let banglaAyahSearchSPD = 1;
let srchMatchpercentege = 60;
const func_arr = [];
let ayahVl = [];
let surah_Index = [];
let interVal_, CpyInterval;
let cpySetTimeOut = 800;
const jsonPTH = `../json/`;
const form_ = q_s(".searchForm");
const stopBTN = q_s(".stopBTN");
const mtcBanglaStr = `0123456789`;
//functions
//--copy text
const copyTXT_ = (txt) => {
  navigator.clipboard.writeText(txt);
  a_class(q_s(".cpy_alert"), "cpy_alert_transition_class");

  setTimeout(() => {
    r_class(q_s(".cpy_alert"), "cpy_alert_transition_class");
  }, cpySetTimeOut);
};
//--get percent to total
const get_percent_to_total = (total, percent) => {
  let cal = (total * percent) / 100;
  return Number(cal.toFixed(0));
};
//--get percent
const get_percent = (total, current) => {
  let cal = (current * 100) / total;
  return cal === 100 ? `${cal.toFixed(0)}%` : `${cal.toFixed(2)}%`;
};
//--form submit
func_arr[0] = {
  q_s: form_,
  ev: "submit",
  f: (e) => {
    e.preventDefault();

    let input_ = e.target.ayahNo.value;

    const show__ = () => {
      _css(q_s(".stopBTNdiv"), {
        transform: "translateX(0%)",
      });

      _css(q_s(".searchComplete"), {
        visibility: "visible",
      });
    };

    if (input_ !== "") {
      let ifed_ = mtcBanglaStr.includes(Array.from(input_)[0]);

      if (!ifed_) {
        show__();

        let arrStr_ = input_.trim().split(` `);

        let fltr_arr_STR = arrStr_.filter((itm) => {
          return itm !== "";
        });

        findAyahsBangla(fltr_arr_STR);
      } else {
        let init_arr = input_.split(",");

        let err_ = 0;
        let filterNumber_Arr = init_arr.filter((it) => {
          return !isNaN(it) ? it : (err_ = 1);
        });

        if (err_ === 0) {
          show__();

          let enNumber = filterNumber_Arr.map((it) => {
            return Number(it);
          });

          ayahVl = enNumber;

          clearInterval(interVal_);
          findAayahs(ayahVl);
        } else {
          alert("wrong input (!)");
          err_ = 0;
        }
      }
    } else {
      alert("please give a ayah number (!)");
    }
  },
};
//--stop searching
func_arr[1] = {
  q_s: stopBTN,
  ev: "click",
  f: () => {
    common_stop_f();
  },
};
//--for copy perpouse
//----mousedown
func_arr[2] = {
  q_s: q_s(".result "),
  ev: "mousedown",
  f: (e) => {
    let list_1 = Array.from(e.target.classList);
    let list_2 = Array.from(e.target.parentNode.classList);

    if (
      list_1.includes("div_wrap") ||
      list_2.includes("div_wrap") ||
      e.target.className === "cpy_mark"
    ) {
      CPYmousedown(e.target);
    }
  },
};
//----mouseup
func_arr[3] = {
  q_s: q_s(".result "),
  ev: "mouseup",
  f: () => {
    CPYmouseup();
  },
};
//--click trigger on search icon click
func_arr[4] = {
  q_s: q_s(".searchIcon_container "),
  ev: "click",
  f: () => {
    q_s("#find_").click();
  },
};
//--show setting on setting gear icon click
func_arr[5] = {
  q_s: q_s(".settings_Gear "),
  ev: "click",
  f: () => {
    q_s("#filter_").value = srchMatchpercentege;

    q_s("#showPERCENT").textContent = `${srchMatchpercentege}%`;

    common_make_percent(highSpeed_init_percent);

    q_s("#filter_2").value = highSpeed_init_percent;

    q_s("#showPERCENT_1").textContent = `${highSpeed_init_percent}%`;

    _css(q_s(".settings_div"), {
      visibility: "visible",
    });

    Array.from(qa_s(".settings_div > div > div")).forEach((dv_, i) => {
      _css(dv_, {
        transform: "translateY(0%)",
        "transition-delay": `${150 * (i / 2.5)}ms`,
      });
    });
  },
};
//--hide setting on click
func_arr[6] = {
  q_s: q_s("body"),
  ev: "click",
  f: (e) => {
    let if_ = Array.from(e.target.classList).includes("settings_div");

    if (if_) {
      _css(q_s(".settings_div"), {
        visibility: "hidden",
      });

      Array.from(qa_s(".settings_div > div > div")).forEach((dv_, i) => {
        _css(dv_, {
          transform: "translateY(-50%)",
          "transition-delay": `0ms`,
        });
      });
    }
  },
};
//--mousedown filter value update start
func_arr[7] = {
  q_s: q_s(`#filter_`),
  ev: "mousedown",
  f: () => {
    on_(q_s("#filter_"), "mousemove", mouseDownFilter);
  },
};
//--remove mousedown event
func_arr[8] = {
  q_s: q_s("#filter_"),
  ev: "mouseup",
  f: () => {
    r_listener(q_s("#filter_"), "mousemove", mouseDownFilter);
  },
};
//--mousedown filter value update start
func_arr[9] = {
  q_s: q_s(`#filter_2`),
  ev: "mousedown",
  f: () => {
    on_(q_s("#filter_2"), "mousemove", mouseDownFilter_1);
  },
};
//--remove mousedown event
func_arr[10] = {
  q_s: q_s("#filter_2"),
  ev: "mouseup",
  f: () => {
    r_listener(q_s("#filter_2"), "mousemove", mouseDownFilter_1);
  },
};
//--common make as percent value
const common_make_percent = (highSpeed_init_percent) => {
  let convertedPercent = get_percent_to_total(
    highSpeed_init,
    100 - highSpeed_init_percent
  );

  getInterVal = convertedPercent + minHeighSPD;
};
//--mousedown start event 1
const mouseDownFilter = (e) => {
  srchMatchpercentege = Number(e.target.value);

  q_s("#showPERCENT").textContent = `${srchMatchpercentege}%`;
};
//--mousedown start event 2
const mouseDownFilter_1 = (e) => {
  highSpeed_init_percent = Number(e.target.value);
  common_make_percent(highSpeed_init_percent);

  q_s("#showPERCENT_1").textContent = `${highSpeed_init_percent}%`;
};
//--mousedown for copy
const CPYmousedown = (e) => {
  let count = 0;

  CpyInterval = setInterval(() => {
    count++;

    if (count > 1) {
      const cmn_ = (prt, prt2) => {
        Array.from(prt.childNodes).forEach((it) => {
          if (it === prt2) {
            let surahN_ = ``;
            for (let i = 0; i < surah_Index.length; i++) {
              const el = surah_Index[i];

              if (el.bangla === prt.childNodes[0].textContent) {
                surahN_ = el.no;
                break;
              }
            }

            let cpyTXT = `Quran( ${surahN_}: ${it.childNodes[0].textContent} )\n\n${it.childNodes[1].textContent}\n\n${it.childNodes[2].textContent}\n\n${it.childNodes[3].textContent}`;
            copyTXT_(cpyTXT);
          }
        });
      };

      if (Array.from(e.classList).includes("div_wrap")) {
        cmn_(e.parentNode, e);
      }

      if (Array.from(e.parentNode.classList).includes("div_wrap")) {
        cmn_(e.parentNode.parentNode, e.parentNode);
      }

      if (e.className === "cpy_mark") {
        cmn_(e.parentNode.parentNode.parentNode, e.parentNode.parentNode);
      }

      clearInterval(CpyInterval);
    }
  }, 1000);
};
//--mouseup for copy
const CPYmouseup = () => {
  clearInterval(CpyInterval);
};
//--filter and highlight bangla
const en_highlight = (banSTR, e) => {
  if (e.length > 1) {
    let oldStr = banSTR;

    for (let i = 0; i < e.length; i++) {
      oldStr = oldStr.replace(
        new RegExp(`${e[i]}`, "gi"),
        `<mark class="cpy_mark">${e[i]}</mark>`
      );
    }

    return oldStr;
  } else {
    return banSTR.replace(
      new RegExp(`${e[0]}`, "gi"),
      `<mark class="cpy_mark">${e[0]}</mark>`
    );
  }
};
//common stop function
const common_stop_f = () => {
  _css(q_s(".stopBTNdiv"), {
    transform: "translateX(100%)",
  });

  _css(q_s(".searchComplete"), {
    visibility: "hidden",
  });

  reset_for_intervals();
  clearInterval(interVal_);
};
//-common large function's reset
const reset_for_intervals = () => {
  isInc = 0;
  isInc_1 = 0;
  glob_i = 0;
};
//--common functions for interval
const common_F_for_intervals = async (
  findBanglaAyahs,
  i,
  isInc,
  isInc_1,
  e
) => {
  let i_ = i + 1;

  if (i < totalAyah && isInc_1 < i_) {
    let search_percent_ = get_percent(totalAyah, i_);
    let search_percent_Div = create_("div");

    search_percent_Div.textContent = `search completed: ${search_percent_}`;
    a_class(search_percent_Div, "search_percent_Div");

    q_s(".searchComplete").innerHTML = "";
    append_(q_s(".searchComplete"), search_percent_Div);

    isInc_1 = i_;

    let div0 = create_("div");
    //_css(div0, { "user-select": "none" });

    const sameF_ = (same_E) => {
      let div_wrap = create_("div");
      a_class(div_wrap, "fd-y");
      a_class(div_wrap, "div_wrap");

      let div2 = create_("div");
      div2.textContent = same_E.id;
      a_class(div2, "surahNo");
      let div3 = create_("div");
      findBanglaAyahs
        ? (div3.innerHTML = en_highlight(same_E.arabic, e))
        : (div3.innerHTML = same_E.arabic);
      let div4 = create_("div");
      findBanglaAyahs
        ? (div4.innerHTML = en_highlight(same_E.bangla, e))
        : (div4.innerHTML = same_E.bangla);
      let div5 = create_("div");
      findBanglaAyahs
        ? (div5.innerHTML = en_highlight(same_E.english, e))
        : (div5.innerHTML = same_E.english);

      append_(div_wrap, div2);
      append_(div_wrap, div3);
      append_(div_wrap, div4);
      append_(div_wrap, div5);

      append_(div0, div_wrap);
    };

    try {
      let data = await Get_Data(`${jsonPTH}quran/`, {
        headers: {
          "content-local-path": `surahs/${i + 1}.json`,
        },
      });

      const commonForEch = (arr) => {
        arr.forEach((it) => {
          if (findBanglaAyahs ? true : data[Number(it) - 1] !== undefined) {
            if (isInc < i_) {
              isInc = i_;

              let filtered = surah_Index.filter((it) => {
                return it.no === i_;
              });

              //filtered[0]. type ayahs no bangla english arabic meanBangla meanEnglish

              let div1 = create_("div");
              div1.textContent = `${filtered[0].bangla}`;
              a_class(div1, "sticky_class");

              append_(div0, div1);

              findBanglaAyahs ? sameF_(it) : sameF_(data[Number(it) - 1]);
            } else {
              findBanglaAyahs ? sameF_(it) : sameF_(data[Number(it) - 1]);
            }
          }
        });
      };

      const checkIfThere = (arr, testSTR) => {
        let found = 0;

        for (let i = 0; i < arr.length; i++) {
          if (testSTR.includes(arr[i])) {
            found++;

            let prcentege = get_percent(arr.length, found);
            if (parseInt(prcentege) >= srchMatchpercentege) {
              break;
            }
          }
        }

        let prcentege = get_percent(arr.length, found);
        return parseInt(prcentege) >= srchMatchpercentege ? true : false;
      };

      if (findBanglaAyahs) {
        let filteredArr = data.filter((it) => {
          return (
            checkIfThere(e, it.arabic) ||
            checkIfThere(e, it.bangla) ||
            checkIfThere(e, it.english)
          );
        });

        filteredArr.length > 0 ? commonForEch(filteredArr) : false;
      } else {
        commonForEch(e);
      }

      append_(q_s(".result"), div0);

      glob_i++;
    } catch (error) {
      console.log(error);
    }
  }

  i_ === totalAyah ? common_stop_f() : false;
};
//--set ayah value
const findAayahs = async (e) => {
  e.sort((a, b) => {
    return a - b;
  });

  if (e.length !== 0) {
    q_s(".result").innerHTML = "";

    let alt_e = Number(q_s("#filter_1").value);

    if (alt_e === 0) {
      const interVal_f = () => {
        common_F_for_intervals(false, glob_i, isInc, isInc_1, e);
      };

      interVal_ = setInterval(interVal_f, getInterVal);
    } else {
      common_F_for_intervals(false, alt_e - 1, isInc, isInc_1, e);
      common_stop_f();
    }
  }
};
//--find ayahs in bangla
const findAyahsBangla = (e) => {
  if (e.length !== 0) {
    q_s(".result").innerHTML = "";

    let alt_e = Number(q_s("#filter_1").value);

    if (alt_e === 0) {
      const interVal_f = () => {
        common_F_for_intervals(true, glob_i, isInc, isInc_1, e);
      };

      interVal_ = setInterval(interVal_f, getInterVal * banglaAyahSearchSPD);
    } else {
      common_F_for_intervals(true, alt_e - 1, isInc, isInc_1, e);
      common_stop_f();
    }
  }
};
//--get data fetch API
const Get_Data = async (url, header) => {
  const returned = await showFTCprogs(url, header);
  return returned;
};
//init
func_arr.forEach((it) => {
  on_(it.q_s, it.ev, it.f);
});

findAayahs(ayahVl);

(async () => {
  surah_Index = await Get_Data(`${jsonPTH}quran/surah_Index.json`);

  surah_Index.forEach((it) => {
    q_s("#filter_1").innerHTML += `<option value="${it.no}">${it.no}</option>`;
  });
})();
