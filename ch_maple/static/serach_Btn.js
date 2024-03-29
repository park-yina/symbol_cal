import { make_card} from "./cal_symbol.js";
import {make_atc_ard} from "./cal_symbol.js";
import { make_arc_card } from "./cal_symbol.js";
export let globalSymbol;
document.addEventListener('DOMContentLoaded', function () {
    const search_btn = document.querySelector('#serach_holder');
    let ocid = "";
    const home_body=document.querySelector(".home_body");
    const tab_buttons = document.querySelectorAll('.tab-button');
    const arc_btn=document.querySelector('#arc');
    const all_btn=document.querySelector('#all');
    const notice=document.querySelectorAll('.on');
    const atc_btn=document.querySelector('#act');
    const job=document.querySelectorAll('.job');
    tab_buttons.forEach(button => {
      button.style.display = 'none';
    });
    if (search_btn != null) {
        search_btn.addEventListener('keydown', function (e) {
            if (e.keyCode === 13 || e.key === 'Enter') {
                const search_detail = $('#serach_holder').val();
                if (search_detail === "") {
                    alert("캐릭터명을 입력해주세요!");
                } else {
                    $.ajax({
                        type: "GET",
                        url: "/default_set",
                        contentType: 'application/json',
                        data: { 'character_name': search_detail },
                        success: function (response) {
                            ocid = response.ocid;
                            get_symbol(ocid);
                        },
                        error: function (error) {
                            console.error('Error:', error);
                        }
                    });
                }
            }
        });
    }

   function get_symbol(ocid) {
        $.ajax({
            type: "GET",
            url: "/symbol_result",
            contentType: 'application/json',
            data: { 'ocid': ocid },
            success: function(response) {
                var character_class = response.character_class;
                var symbol=response.symbol;
                globalSymbol=symbol
                    $.ajax({
                    type: "POST",
                    url: "/symbol_char",
                    contentType: 'application/json',
                    data: JSON.stringify({ 'character_class': character_class, 'symbol': symbol }),
                    success: function(postResponse) {
                        job[0].style.display='initial';
                        updateUI(postResponse);
                        make_card(postResponse);
                        arc_btn.addEventListener('click',()=>{
                            job[1].style.display='inline';
                            job[2].style.display='none';
                          make_arc_card(postResponse)
                          
                        });
                        all_btn.addEventListener('click',()=>{
                            make_card(postResponse)
                        });
                        atc_btn.addEventListener('click',()=>{
                            job[1].style.display='none';
                            job[2].style.display='inline';
                            make_atc_ard(postResponse)
                        })
                    },
                    error: function(postError) {
                        console.error(postError);
                    }
                });
            },
            error: function(error) {
            }
        });
    }
    function updateUI(response) {
        console.log(response);
        var resultSpan = $(".home_body #characterNameSpan");
    
        if (!resultSpan.length) {
            console.error("Span element not found.");
            return;
        }
    
        if (response.character_class) {
            resultSpan.text(response.character_class);
            home_body.style.height='min-content';
            tab_buttons.forEach(button => {
                button.style.display = 'block';
            });
            notice.forEach(button=>{
                button.style.display='none';
            })
            
            


        } else {
            resultSpan.text("No character class available");
        }
    }
});
