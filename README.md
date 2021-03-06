![띵동앱포스터_수정(재단선X)_page-0001](https://user-images.githubusercontent.com/45285053/63635177-7fa08400-c69a-11e9-96cf-ed534a30413d.jpg)
1.프로젝트 소개
Ddingdong Project의 탄생 계기는 메뉴판이 필요 없는 식당 환경을 제공하기 위함이었다. 현대 한국인들 중에서 스마트폰은 대부분의 사람이 사용하기 때문에 충분히 실현 가능성이 있다고 판단했다. Ddingdong 홈페이지에 등록되어있는 가게들의 메뉴 정보가 서버에 있는 DB에 저장되어있고, 가게마다 QR코드를 발급해 주어서 식당 고객이 왔을 때 QR코드만 찍으면 해당 식당의 메뉴 정보와 사람들이 올린 후기들을 한눈에 볼 수 있는 서비스를 제공한다. 후기정보들은 Naver 검색엔진을 통해서 크롤링 한 데이터를 보여주게 된다. 추가적으로 음식 주문 서비스까지 개발해서 식당에 들어온 고객이 해당 가게의 페이지의 주문 창에 주문 목록을 전송하면 가게 사장의 페이지에서 확인하고 소켓 통신을 통해서 체팅까지 가능한 서비스를 제공한다. 정리하면 Ddingdong 프로젝트는 가게의 사장이 회원가입을 해서 가게의 정보를 입력하면 QR코드를 발급받고, 가게에 찾아온 고객이 QR코드를 통해 앱에 들어오면 가게의 정보를 즉시 볼 수 있고 주문까지 가능한 서비스를 제공하는 프로그램을 개발하는 프로젝트이다.

2-1) 개발 플랫폼 소개
개발 언어 : JavaScript(React 라이브러리) , HTML, CSS
데이터베이스 : MySQL,MariaDB
서버 : AWS (Amazon Web Services) , Express, GCP(Google Cloud Platform)
도메인 호스팅 : Freenom

 

3-1) JavaScript Code Flow
리엑트 구현파트
띵동 홈페이지는 각 지역, 음식분류등으로 여러 조건으로 다른 정보를 보여주어야합니다. 그래서 리액트를 이용하여 컴포넌트를 크게 Category, Header, Footer, List,Menu,Signin,Signup,StoreManage로 나누었습니다. 1.App.js
React Router의 라우팅 작업을 위한 컴포넌트이므로 Route태그를 통하여 해당 url로 접근 시 해당 컴포넌트를 보여줄 수 있는 역할을 합니다. 리액트 프로젝트이기 때문에 새로고침등 없이 컴포넌트만 랜더링됩니다. 2.Category
Header컴포넌트와 함께 메인페이지를 장식하며 위치정보를 입력 후 분류된 8개의 영역을 클릭하면 해당된 List컴포넌트를 보여줍니다. 분류는 한식,양식,중식,일식,치킨,피자,족발&보쌈,분식으로 나누어져있으며 React Router를 이용하여 Link태그로 url을 변경하여 List컴포넌트를 렌더링해줍니다. 3.Header
웹페이지의 헤더부분을 담당하는 컴포넌트로 메인페이지일 때는 큰 화면으로 나오며 그 이외의 페이지에서는 작은 부분으로 변경됩니다. 가장 큰 역할은 메인페이지로의 이동기능과 현재 사용자 위치 입력기능이 있습니다. 입력창부분에 현재 위치를 입력하면 해당하는 주소를 autocomplete하여 보여줍니다. 그러면 사용자는 이들 중 하나를 선택하면 현재 위치가 우편번호를 기준으로 세팅됩니다. 우편번호는 sessionStorage에 저장됩니다. 여기서 Category에 있는 분류들 중 하나를 선택하면 그 위치에 해당 분류 음식점을 보여주며 입력창 옆에 검색버튼을 누를 시에 해당 위치에 있는 모든 음식점을 보여주게 됩니다. 4.Footer
우리팀의 정보를 간단하게 보여주고 사장님들이 본인의 상점을 관리할 수 있는 컴포넌트로 이동할 수 있는 버튼이 존재합니다. 5.List
입력 받은 위치와 분류를 기준으로 express서버와 통신하여 식당들의 리스트를 보여줍니다. 분류는 url을 통하여 ddingdong.gq/list/koreanfood와 같이 받습니다. 식당들의 리스트를 서버를 통해 받으면 State에 저장되어 관리됩니다. Header의 아래부분에는 네비게이션이 있어서 새로고침 없이 렌더링을 통하여 각기 다른 데이터를 보여줍니다. 한 식당이 클릭되면 해당 식당의 ID를 url에 더하게 됩니다.

6.Menu
렌더링 전에 url에 있는 식당ID를 기준으로 해당 식당의 모든 정보를 받아옵니다. 이를 sessionStorage에 저장한 후 받아 온 식당이름을 기준으로 크롤링을 요청합니다. 모든 데이터가 준비되었다면 식당이름, 메인사진, 메뉴판, 인기메뉴정보, 해당식당의 블로그 관련 포스팅, 식당 기본 정보들을 보여줍니다. 인기메뉴정보는 주문하기 기능을 통해 자체적인 데이터를 수집하여 주문비율이 가장 높은 음식들을 그래프를 통해서 보여줍니다. 이를 통해서 고객들은 기존의 메뉴판과는 차별화된 정보를 새로운 띵동 메뉴판을 통해서 얻을 수 있습니다. 오른쪽 아래에는 주문하기 버튼이 따라다녀서 손쉽게 주문하기로 이동할 수 있습니다. 7.Order
메뉴페이지에서 접근할 수 있는 주문기능이 있는 페이지로서 식당의 메뉴들과 수량선택버튼, 고객이 앉은 테이블 번호입력창, 특이사항요청입력창이 있습니다. 테이블 번호는 필수 입력사항이고 메뉴들의 수량버튼이 변경될 때마다 합계가 변경되어 최종금액을 알 수 있습니다. 이렇게 입력을 마친 후 주문하기 버튼을 입력하면 해당 가게의 사장님 계정으로 socket.io를 통하여 전송하게 됩니다. -Socket.io 고객이 해당 홈페이지에 접속해서 식당 메뉴를 고르고 주문을 할 때 주문 내용이 해당 가게 주인에게 가기 위해서 Socket.io를 통해 통신 관련 코드를 작성하였습니다. 대략적인 흐름은 우선 가게 주인이 ‘http://ddingdong.gq/Storemange’에 접속하게 되면 각 고유 가게 번호인 StoreId를 이용하여 고유 Socket 통신망에 접근하게 됩니다. 그리고 나서 고객은 주문하기 버튼을 통해서 io.emit을 통해 서버에 정보들을 보냅니다. 보내는 정보에는 StoreId가 포함되어 있어서 서버에서 이 정보를 받으면 특정 통신망에 해당 데이터를 보내고 가게 주인이 정보들을 받아서 ModalBox를 통해서 정보들을 받을 수 있도록 구현하였습니다. 8.Signin
먼저 서버에 요청을 하여 토큰을 통하여 현재 로그인된 사용자인지, 로그인되었다면 기간이 만료된 사용자인지 확인하여 아니라면 로그인페이지를 보여주고 맞다면 본인의 상점관리 페이지로 들어갈수있는 컴포넌트를 보여줍니다. 로그인을 통하여 서버로부터 발급받은 토큰은 sessionStorage에 저장됩니다. 이는 암호화되어 보안성을 높혀줍니다. 로그아웃시에는 sessionStorage의 토큰을 파기하여 로그아웃처리합니다. 9.Signup
회원가입 컴포넌트로 사용자의 기본정보를 입력받아 서버로 전송하여 데이터베이스에 저장할 수 있도록 합니다.

10.StoreManage
사장님의 상점관리 페이지로서 처음에는 토큰의 유효성을 확인합니다. 문제가 없다면 서버에 토큰을 전송하여 주문을 받을 수 있도록 socket.io를 실행하며 해당 가게데이터를 받아와 State에 저장합니다. 만약 현재 가진 가게가 없다면 가게를 추가할 수 있도록 버튼을 렌더링해줍니다. 이 페이지에는 3개의 Modal박스가 있습니다. 가게를 수정하거나 추가할 수 있는 Modal, 가게의 주소를 입력할 수 있는 다음 API를 보여주는 Modal, 주문이 들어오면 주문 정보를 보여주는 Modal입니다. 수정하기와 추가하기는 같은 코드에서 실행되며 하단의 버튼이 “수정하기”인지 “추가하기”인지 확인하여 서버에서는 이를 다르게 처리 할 수 있습니다. 수정되거나 추가된 정보는 json형태로 서버에 전송됩니다. 이미지가 수정된다면 서버로 수정된 파일의 정보가 전송됩니다. 그러면 서버는 크게 mainImg와 menuImg로 분류해서 처리합니다. mainImg는 메인사진으로 하나이므로 수정됐다면 서버에 main.jpg로 수정하여 저장합니다. menuImg는 배열로서 input태그로 입력받은 이미지파일의 originalname그대로 서버에 내 ID폴더에 저장됩니다. 이는 다른 컴포넌트에서도 저장된 파일의 목록을 가져와 보여줄 수 있도록 도와줍니다. 각 메뉴들은 json으로 해당 이미지의 이름을 가지고 있기 때문에 수정/추가사항을 오류없이 보여줄 수 있습니다. 또한 이곳에서 사장님은 본인 가게의 QR코드를 얻어 식당 내에 적용할 수 있습니다.

Express.js
저희 프로젝트는 backend-server 구현시 Express.js를 사용해서 개발했습니다. Express.js는 Node.js기반의 웹 프레임워크입니다. 저희 프로젝트에서 express서버는 리액트가 요청하는 api를 구현하고 DB와 연동되는 역할을 합니다. 각각의 Request가 어떠한 기능과 응답을 하는지 정리했습니다. const express = require('express');
const bodyparser = require('body-parser');
서버생성을 위한 모듈입니다. Bodyparser는 json파일 응답을 위한 모듈입니다.
const router = express.Router();
요청되는 Request에 대한 중복응답을 방지하는 모듈입니다.
res.header("Access-Control-Allow-Headers", "");
res.header("Access-Control-Allow-Origin", "");
응답시 반드시 추가되는 헤더정보입니다. CORS정책사용을 위한 코드입니다.

“/list”
음식점을 카테고리 별로 분류해서 보여줍니다.
“/signup”
회원가입요청을 받아 DB에 입력합니다.
“/signin”
로그인요청을 받아 입력정보의 유효성검사를 하고 일정시간 유지되는 세션의 토큰을 발급합니다.
“/menu”
선택된 가게의 메뉴판을 불러옵니다.
“/storemanage”
클라이언트들이 받은 주문정보를 클라이언트에게 전달합니다.
고객들이 주문정보를 보내고 socket고유 통신망에 연결합니다.
“/storemanage/menu”
메뉴정보를 입력받습니다. 주문된 정보들을 DB에 반영할 수 있도록 객체로 저장합니다.
“/order
주문된 정보를 DB에 입력합니다.
“/storemanage/fix”
가게 정보를 수정합니다. 이미지의 경우 회원가입시 생성된 폴더에 저장합니다.
“/menu/search”
음식점 후기를 크롤링해서 반환합니다.


3-2) 서버, 데이터베이스

AWS : React, Express 서버 구동(Linux Ubuntu 18.04)

GCP : Database 서버 구동 (Linux Ubuntu 18.04)

MySQL : 가게 정보 및 회원 정보 데이터 저장

Freenom : 서버 도메인 호스팅
