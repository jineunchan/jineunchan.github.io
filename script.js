document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const playerView = document.getElementById('player-view');
    const gun = document.getElementById('gun');
    const bulletImpacts = document.getElementById('bullet-impacts');

    let mouseX = 0;
    let mouseY = 0;
    let rotationY = 0; // 좌우 시야각
    let rotationX = 0; // 상하 시야각
    const rotationSpeed = 0.1; // 마우스 감도

    let playerX = 0;
    let playerZ = 0; // 앞뒤 이동 (Z축)
    let playerY = 0; // 상하 이동 (Y축 - 아직 구현 안 함)
    const moveSpeed = 10;

    const walls = []; // 벽 요소를 저장할 배열

    // 가상의 3D 공간을 구성할 벽들을 생성합니다.
    function createWalls() {
        const wallData = [
            { className: 'front', z: -300 },
            { className: 'back', z: 300, rotateY: 180 },
            { className: 'left', x: -400, rotateY: 90, width: 600, height: '100%' },
            { className: 'right', x: 400, rotateY: -90, width: 600, height: '100%' },
            { className: 'floor', y: 300, rotateX: 90, height: 800 },
            { className: 'ceiling', y: -300, rotateX: -90, height: 800 }
        ];

        wallData.forEach(data => {
            const wall = document.createElement('div');
            wall.classList.add('wall', data.className);
            wall.style.width = data.width || '100%';
            wall.style.height = data.height || '100%';
            wall.style.position = 'absolute';
            // CSS에서 transform을 직접 적용했기 때문에 여기서 직접적인 transform 조작은 최소화
            // 대신, player-view의 transform에 따라 상대적으로 움직이도록 합니다.
            // 여기서는 벽을 플레이어 뷰에 직접 추가하여 '월드'를 만듭니다.
            playerView.appendChild(wall);
            walls.push(wall); // 나중에 업데이트할 경우를 대비해 저장
        });
    }

    createWalls();


    // 마우스 움직임으로 시야 회전
    gameContainer.addEventListener('mousemove', (e) => {
        // gameContainer 내부에서의 상대적인 마우스 위치
        const rect = gameContainer.getBoundingClientRect();
        mouseX = e.clientX - rect.left - rect.width / 2;
        mouseY = e.clientY - rect.top - rect.height / 2;

        rotationY = mouseX * rotationSpeed;
        rotationX = -mouseY * rotationSpeed; // 마우스를 위로 올리면 시야가 위로 향하게

        // 시야각 제한 (너무 위나 아래를 보지 않도록)
        if (rotationX > 60) rotationX = 60;
        if (rotationX < -60) rotationX = -60;

        updatePlayerView();
    });

    // 마우스 클릭으로 총 발사
    gameContainer.addEventListener('mousedown', () => {
        gun.style.transform = 'translateY(10px) rotateZ(-5deg)'; // 총 발사 애니메이션
        // 총알 자국 생성
        createBulletImpact();
    });

    gameContainer.addEventListener('mouseup', () => {
        gun.style.transform = 'translateY(0) rotateZ(0)'; // 총 복귀
    });

    // 키보드 입력 처리
    const keys = {};
    document.addEventListener('keydown', (e) => {
        keys[e.code] = true;
    });

    document.addEventListener('keyup', (e) => {
        keys[e.code] = false;
    });

    // 플레이어 이동 업데이트
    function updatePlayerMovement() {
        const rad = rotationY * (Math.PI / 180); // 현재 시야각 (라디안)

        if (keys['KeyW']) { // 앞으로 이동
            playerX += Math.sin(rad) * moveSpeed;
            playerZ -= Math.cos(rad) * moveSpeed;
        }
        if (keys['KeyS']) { // 뒤로 이동
            playerX -= Math.sin(rad) * moveSpeed;
            playerZ += Math.cos(rad) * moveSpeed;
        }
        if (keys['KeyA']) { // 왼쪽으로 이동
            playerX -= Math.cos(rad) * moveSpeed;
            playerZ -= Math.sin(rad) * moveSpeed;
        }
        if (keys['KeyD']) { // 오른쪽으로 이동
            playerX += Math.cos(rad) * moveSpeed;
            playerZ += Math.sin(rad) * moveSpeed;
        }

        updatePlayerView();
    }

    // 플레이어 시야 (playerView) 업데이트
    function updatePlayerView() {
        // 플레이어의 이동을 역방향으로 적용하여 월드가 움직이는 것처럼 보이게 함
        playerView.style.transform = `
            translateZ(${-playerZ}px)
            translateX(${-playerX}px)
            rotateX(${rotationX}deg)
            rotateY(${rotationY}deg)
        `;
    }

    // 총알 자국 생성
    function createBulletImpact() {
        const impact = document.createElement('div');
        impact.classList.add('bullet-impact');

        // 총알 자국은 단순히 화면 중앙에 표시 (실제 3D 충돌 계산 없음)
        impact.style.left = '50%';
        impact.style.top = '50%';

        bulletImpacts.appendChild(impact);

        // 일정 시간 후 제거
        setTimeout(() => {
            impact.remove();
        }, 500);
    }

    // 게임 루프
    function gameLoop() {
        updatePlayerMovement();
        requestAnimationFrame(gameLoop);
    }

    // 게임 시작
    gameLoop();
});
