import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/app/store/hooks';
import { Spin, Button, Select, Input, message, Modal, Card, Popover, Tag, Space, Form } from 'antd';
import { UsersService } from '@/entities/user/api/userService';
import dayjs from 'dayjs';

interface Player {
  id: string;
  name: string;
  number: string;
  roles: ('GK' | 'DF' | 'MF' | 'FW')[];
}

interface PositionConfig {
  key: string;
  label: string;
  top: string;
  left: string;
  role: 'GK' | 'DF' | 'MF' | 'FW';
}

const FORMATIONS: { [key: string]: { label: string; positions: PositionConfig[] } } = {
  // --- SÂN 5 NGƯỜI ---
  '5-1-2-1': {
    label: 'Kim Cương (1-2-1)',
    positions: [
      { key: 'GK', label: 'GK', top: '85%', left: '50%', role: 'GK' },
      { key: 'DF', label: 'DF', top: '65%', left: '50%', role: 'DF' },
      { key: 'LMF', label: 'LMF', top: '45%', left: '20%', role: 'MF' },
      { key: 'RMF', label: 'RMF', top: '45%', left: '80%', role: 'MF' },
      { key: 'FW', label: 'FW', top: '25%', left: '50%', role: 'FW' },
    ]
  },
  '5-2-0-2': {
    label: 'Tứ Giác (2-0-2)',
    positions: [
      { key: 'GK', label: 'GK', top: '85%', left: '50%', role: 'GK' },
      { key: 'LDF', label: 'LDF', top: '65%', left: '30%', role: 'DF' },
      { key: 'RDF', label: 'RDF', top: '65%', left: '70%', role: 'DF' },
      { key: 'LFW', label: 'LFW', top: '25%', left: '30%', role: 'FW' },
      { key: 'RFW', label: 'RFW', top: '25%', left: '70%', role: 'FW' },
    ]
  },
  '5-3-0-1': {
    label: 'Phòng Ngự (3-0-1)',
    positions: [
      { key: 'GK', label: 'GK', top: '85%', left: '50%', role: 'GK' },
      { key: 'LDF', label: 'LDF', top: '65%', left: '25%', role: 'DF' },
      { key: 'CDF', label: 'CDF', top: '68%', left: '50%', role: 'DF' },
      { key: 'RDF', label: 'RDF', top: '65%', left: '75%', role: 'DF' },
      { key: 'FW', label: 'FW', top: '25%', left: '50%', role: 'FW' },
    ]
  },
  '5-1-1-2': {
    label: 'Song Sát (1-1-2)',
    positions: [
      { key: 'GK', label: 'GK', top: '85%', left: '50%', role: 'GK' },
      { key: 'DF', label: 'DF', top: '68%', left: '50%', role: 'DF' },
      { key: 'MF', label: 'MF', top: '48%', left: '50%', role: 'MF' },
      { key: 'LFW', label: 'LFW', top: '25%', left: '30%', role: 'FW' },
      { key: 'RFW', label: 'RFW', top: '25%', left: '70%', role: 'FW' },
    ]
  },
  // --- SÂN 7 NGƯỜI ---
  '7-2-3-1': {
    label: 'Cổ Điển (2-3-1)',
    positions: [
      { key: 'GK', label: 'GK', top: '85%', left: '50%', role: 'GK' },
      { key: 'LDF', label: 'LDF', top: '68%', left: '30%', role: 'DF' },
      { key: 'RDF', label: 'RDF', top: '68%', left: '70%', role: 'DF' },
      { key: 'LMF', label: 'LMF', top: '45%', left: '15%', role: 'MF' },
      { key: 'CMF', label: 'CMF', top: '45%', left: '50%', role: 'MF' },
      { key: 'RMF', label: 'RMF', top: '45%', left: '85%', role: 'MF' },
      { key: 'FW', label: 'FW', top: '22%', left: '50%', role: 'FW' },
    ]
  },
  '7-3-2-1': {
    label: 'Cây Thông (3-2-1)',
    positions: [
      { key: 'GK', label: 'GK', top: '85%', left: '50%', role: 'GK' },
      { key: 'LDF', label: 'LDF', top: '68%', left: '20%', role: 'DF' },
      { key: 'CDF', label: 'CDF', top: '72%', left: '50%', role: 'DF' },
      { key: 'RDF', label: 'RDF', top: '68%', left: '80%', role: 'DF' },
      { key: 'LCMF', label: 'LCMF', top: '45%', left: '33%', role: 'MF' },
      { key: 'RCMF', label: 'RCMF', top: '45%', left: '67%', role: 'MF' },
      { key: 'FW', label: 'FW', top: '22%', left: '50%', role: 'FW' },
    ]
  },
  '7-3-1-2': {
    label: 'Phản Công (3-1-2)',
    positions: [
      { key: 'GK', label: 'GK', top: '85%', left: '50%', role: 'GK' },
      { key: 'LDF', label: 'LDF', top: '68%', left: '25%', role: 'DF' },
      { key: 'CDF', label: 'CDF', top: '72%', left: '50%', role: 'DF' },
      { key: 'RDF', label: 'RDF', top: '68%', left: '75%', role: 'DF' },
      { key: 'CMF', label: 'CMF', top: '48%', left: '50%', role: 'MF' },
      { key: 'LS', label: 'LS', top: '25%', left: '35%', role: 'FW' },
      { key: 'RS', label: 'RS', top: '25%', left: '65%', role: 'FW' },
    ]
  },
  '7-1-3-2': {
    label: 'Tấn Công (1-3-2)',
    positions: [
      { key: 'GK', label: 'GK', top: '85%', left: '50%', role: 'GK' },
      { key: 'DF', label: 'DF', top: '72%', left: '50%', role: 'DF' },
      { key: 'LMF', label: 'LMF', top: '50%', left: '20%', role: 'MF' },
      { key: 'CMF', label: 'CMF', top: '52%', left: '50%', role: 'MF' },
      { key: 'RMF', label: 'RMF', top: '50%', left: '80%', role: 'MF' },
      { key: 'LS', label: 'LS', top: '25%', left: '35%', role: 'FW' },
      { key: 'RS', label: 'RS', top: '25%', left: '65%', role: 'FW' },
    ]
  },
  // --- SÂN 11 NGƯỜI ---
  '11-4-3-3': {
    label: 'Tấn Công (4-3-3)',
    positions: [
      { key: 'GK', label: 'GK', top: '88%', left: '50%', role: 'GK' },
      { key: 'LB', label: 'LB', top: '70%', left: '15%', role: 'DF' },
      { key: 'LCB', label: 'LCB', top: '72%', left: '38%', role: 'DF' },
      { key: 'RCB', label: 'RCB', top: '72%', left: '62%', role: 'DF' },
      { key: 'RB', label: 'RB', top: '70%', left: '85%', role: 'DF' },
      { key: 'LCM', label: 'LCM', top: '50%', left: '30%', role: 'MF' },
      { key: 'DM', label: 'DM', top: '55%', left: '50%', role: 'MF' },
      { key: 'RCM', label: 'RCM', top: '50%', left: '70%', role: 'MF' },
      { key: 'LW', label: 'LW', top: '28%', left: '20%', role: 'FW' },
      { key: 'ST', label: 'ST', top: '25%', left: '50%', role: 'FW' },
      { key: 'RW', label: 'RW', top: '28%', left: '80%', role: 'FW' },
    ]
  },
  '11-4-4-2': {
    label: 'Song Sát (4-4-2)',
    positions: [
      { key: 'GK', label: 'GK', top: '88%', left: '50%', role: 'GK' },
      { key: 'LB', label: 'LB', top: '70%', left: '15%', role: 'DF' },
      { key: 'LCB', label: 'LCB', top: '72%', left: '38%', role: 'DF' },
      { key: 'RCB', label: 'RCB', top: '72%', left: '62%', role: 'DF' },
      { key: 'RB', label: 'RB', top: '70%', left: '85%', role: 'DF' },
      { key: 'LM', label: 'LM', top: '48%', left: '15%', role: 'MF' },
      { key: 'LCM', label: 'LCM', top: '50%', left: '38%', role: 'MF' },
      { key: 'RCM', label: 'RCM', top: '50%', left: '62%', role: 'MF' },
      { key: 'RM', label: 'RM', top: '48%', left: '85%', role: 'MF' },
      { key: 'LS', label: 'LS', top: '25%', left: '35%', role: 'FW' },
      { key: 'RS', label: 'RS', top: '25%', left: '65%', role: 'FW' },
    ]
  },
  '11-3-5-2': {
    label: 'Kiểm Soát (3-5-2)',
    positions: [
      { key: 'GK', label: 'GK', top: '88%', left: '50%', role: 'GK' },
      { key: 'LCB', label: 'LCB', top: '72%', left: '28%', role: 'DF' },
      { key: 'CB', label: 'CB', top: '74%', left: '50%', role: 'DF' },
      { key: 'RCB', label: 'RCB', top: '72%', left: '72%', role: 'DF' },
      { key: 'LWB', label: 'LWB', top: '52%', left: '12%', role: 'MF' },
      { key: 'LDM', label: 'LDM', top: '56%', left: '35%', role: 'MF' },
      { key: 'CAM', label: 'CAM', top: '44%', left: '50%', role: 'MF' },
      { key: 'RDM', label: 'RDM', top: '56%', left: '65%', role: 'MF' },
      { key: 'RWB', label: 'RWB', top: '52%', left: '88%', role: 'MF' },
      { key: 'LS', label: 'LS', top: '25%', left: '35%', role: 'FW' },
      { key: 'RS', label: 'RS', top: '25%', left: '65%', role: 'FW' },
    ]
  },
  '11-4-5-1': {
    label: 'Chặt Chẽ (4-5-1)',
    positions: [
      { key: 'GK', label: 'GK', top: '88%', left: '50%', role: 'GK' },
      { key: 'LB', label: 'LB', top: '70%', left: '15%', role: 'DF' },
      { key: 'LCB', label: 'LCB', top: '72%', left: '38%', role: 'DF' },
      { key: 'RCB', label: 'RCB', top: '72%', left: '62%', role: 'DF' },
      { key: 'RB', label: 'RB', top: '70%', left: '85%', role: 'DF' },
      { key: 'LM', label: 'LM', top: '48%', left: '15%', role: 'MF' },
      { key: 'LCM', label: 'LCM', top: '52%', left: '35%', role: 'MF' },
      { key: 'DM', label: 'DM', top: '58%', left: '50%', role: 'MF' },
      { key: 'RCM', label: 'RCM', top: '52%', left: '65%', role: 'MF' },
      { key: 'RM', label: 'RM', top: '48%', left: '85%', role: 'MF' },
      { key: 'ST', label: 'ST', top: '25%', left: '50%', role: 'FW' },
    ]
  }
};

const TeamManagement: React.FC = () => {
  const user = useAppSelector((state) => state.user.currentUser);

  // --- Core States ---
  const [roster, setRoster] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem('pitchhub_team_roster');
      const loaded = saved ? JSON.parse(saved) : [
        { id: '1', name: 'Marcus F.', number: '1', roles: ['GK'] },
        { id: '2', name: 'Sarah K.', number: '4', roles: ['DF', 'MF'] },
        { id: '3', name: 'Virgil V.', number: '5', roles: ['DF'] },
        { id: '4', name: 'David L.', number: '8', roles: ['MF'] },
        { id: '5', name: 'Toni K.', number: '6', roles: ['MF'] },
        { id: '6', name: 'Alex M.', number: '9', roles: ['FW'] },
        { id: '7', name: 'Leo M.', number: '10', roles: ['FW', 'MF'] },
        { id: '8', name: 'John D.', number: '3', roles: ['DF'] },
      ];
      // Convert legacy singular 'role' to array 'roles'
      return loaded.map((p: any) => {
        if (!p.roles && p.role) {
          return {
            id: p.id,
            name: p.name,
            number: p.number,
            roles: [p.role]
          };
        }
        return p;
      });
    } catch {
      return [];
    }
  });

  const [activeMatch, setActiveMatch] = useState<string>('default');
  
  const [lineups, setLineups] = useState<{
    [matchId: string]: {
      formation: string;
      positions: { [posKey: string]: string | null };
    };
  }>(() => {
    try {
      const saved = localStorage.getItem('pitchhub_team_lineups');
      return saved ? JSON.parse(saved) : {
        'default': {
          formation: '7-2-3-1',
          positions: {
            'GK': '1',
            'LDF': '2',
            'RDF': '3',
            'LMF': '5',
            'CMF': '4',
            'RMF': '8',
            'FW': '6',
          }
        }
      };
    } catch {
      return {};
    }
  });

  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // --- Add/Edit Player Modal States ---
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [playerForm] = Form.useForm();

  // --- Persist Data to localStorage ---
  useEffect(() => {
    localStorage.setItem('pitchhub_team_roster', JSON.stringify(roster));
  }, [roster]);

  useEffect(() => {
    localStorage.setItem('pitchhub_team_lineups', JSON.stringify(lineups));
  }, [lineups]);

  // --- Fetch Bookings from API ---
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setBookingsLoading(true);
        const res = await UsersService.getHistoryBooking(1);
        const history = res.history || [];
        // Filter approved or confirmed matches to schedule
        const activeMatches = history.filter(
          (b: any) => b.status === 'approved' || b.status === 'confirmed'
        );
        setBookings(activeMatches);
      } catch (e) {
        console.error('Failed to load user booking matches:', e);
      } finally {
        setBookingsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // --- Active Lineup Config ---
  const currentLineup = lineups[activeMatch] || {
    formation: '7-2-3-1',
    positions: {}
  };
  const currentFormation = currentLineup.formation;
  const currentPositions = FORMATIONS[currentFormation]?.positions || FORMATIONS['7-2-3-1'].positions;
  const currentAssigns = currentLineup.positions || {};
  const activePitchType = currentFormation.startsWith('11-') ? '11' : currentFormation.startsWith('7-') ? '7' : '5';

  // --- Roster Actions ---
  const handleOpenAddPlayer = () => {
    setEditingPlayer(null);
    playerForm.resetFields();
    setIsPlayerModalOpen(true);
  };

  const handleOpenEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    playerForm.setFieldsValue(player);
    setIsPlayerModalOpen(true);
  };

  const handleSavePlayer = () => {
    playerForm.validateFields().then((values) => {
      if (editingPlayer) {
        // Edit Mode
        const updated = roster.map((p) => (p.id === editingPlayer.id ? { ...p, ...values } : p));
        setRoster(updated);
        message.success('Đã cập nhật thông tin cầu thủ');
      } else {
        // Add Mode
        const newPlayer: Player = {
          id: String(Date.now()),
          name: values.name,
          number: values.number,
          roles: values.roles
        };
        setRoster([...roster, newPlayer]);
        message.success('Đã thêm cầu thủ mới vào danh sách');
      }
      setIsPlayerModalOpen(false);
    });
  };

  const handleDeletePlayer = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa cầu thủ',
      content: 'Bạn có chắc chắn muốn xóa cầu thủ này khỏi danh sách? Cầu thủ sẽ bị xóa khỏi mọi sơ đồ chiến thuật đã gán.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        // Filter out of roster
        setRoster(roster.filter((p) => p.id !== id));
        
        // Clean up from all lineups
        const updatedLineups = { ...lineups };
        Object.keys(updatedLineups).forEach((matchKey) => {
          const pos = { ...updatedLineups[matchKey].positions };
          Object.keys(pos).forEach((posKey) => {
            if (pos[posKey] === id) {
              pos[posKey] = null;
            }
          });
          updatedLineups[matchKey] = {
            ...updatedLineups[matchKey],
            positions: pos
          };
        });
        setLineups(updatedLineups);
        message.success('Đã xóa cầu thủ khỏi danh sách đội');
      }
    });
  };

  // --- Lineup Actions ---
  const handleSelectFormation = (value: string) => {
    const updatedLineups = { ...lineups };
    const prevPositions = currentAssigns;
    const newPositions: { [posKey: string]: string | null } = {};
    
    // Copy existing player assignments if roles match, or keep them if they are still on the field
    const newFormationPositions = FORMATIONS[value].positions;
    newFormationPositions.forEach((pos) => {
      newPositions[pos.key] = prevPositions[pos.key] || null;
    });

    updatedLineups[activeMatch] = {
      formation: value,
      positions: newPositions
    };
    setLineups(updatedLineups);
    const sizeStr = value.split('-')[0];
    message.info(`Đã đổi sang sơ đồ Sân ${sizeStr} - ${FORMATIONS[value].label}`);
  };

  const handleSelectPitchType = (pitchType: string) => {
    const firstFormation = Object.keys(FORMATIONS).find((k) => k.startsWith(`${pitchType}-`));
    if (firstFormation) {
      handleSelectFormation(firstFormation);
    }
  };

  const handleAssignPlayer = (posKey: string, playerId: string | null) => {
    const updatedLineups = { ...lineups };
    const currentPositionsAssigns = { ...currentAssigns };

    if (playerId) {
      // Rule: A player can only be in one position at a time on the pitch
      // Search if this player is already assigned elsewhere in this lineup and clear them
      Object.keys(currentPositionsAssigns).forEach((key) => {
        if (currentPositionsAssigns[key] === playerId) {
          currentPositionsAssigns[key] = null;
        }
      });
      currentPositionsAssigns[posKey] = playerId;
    } else {
      currentPositionsAssigns[posKey] = null;
    }

    updatedLineups[activeMatch] = {
      formation: currentFormation,
      positions: currentPositionsAssigns
    };
    setLineups(updatedLineups);
  };

  const handleAutoFill = () => {
    const currentPositionsAssigns = { ...currentAssigns };
    // Get currently assigned players in this lineup
    const assignedIds = new Set(Object.values(currentPositionsAssigns).filter(Boolean) as string[]);

    currentPositions.forEach((pos) => {
      if (!currentPositionsAssigns[pos.key]) {
        // 1. Find a roster player with matching role who is NOT assigned
        let candidate = roster.find((p) => !assignedIds.has(p.id) && p.roles?.includes(pos.role));
        
        // 2. If no matching role, find ANY unassigned player
        if (!candidate) {
          candidate = roster.find((p) => !assignedIds.has(p.id));
        }

        if (candidate) {
          currentPositionsAssigns[pos.key] = candidate.id;
          assignedIds.add(candidate.id);
        }
      }
    });

    setLineups({
      ...lineups,
      [activeMatch]: {
        formation: currentFormation,
        positions: currentPositionsAssigns
      }
    });
    message.success('Đã tự động sắp xếp cầu thủ vào các vị trí trống phù hợp!');
  };

  const handleClearLineup = () => {
    const updatedLineups = { ...lineups };
    const cleared: { [posKey: string]: string | null } = {};
    currentPositions.forEach((pos) => {
      cleared[pos.key] = null;
    });

    updatedLineups[activeMatch] = {
      formation: currentFormation,
      positions: cleared
    };
    setLineups(updatedLineups);
    message.success('Đã xóa tất cả cầu thủ khỏi sân bóng');
  };

  // --- Export PNG Canvas Action ---
  const handleExportPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 750;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      message.error('Trình duyệt không hỗ trợ tạo Canvas');
      return;
    }

    // 1. Lush grass emerald gradient background
    const grad = ctx.createLinearGradient(0, 0, 0, 1000);
    grad.addColorStop(0, '#064e3b'); // Emerald-900
    grad.addColorStop(0.5, '#047857'); // Emerald-700
    grad.addColorStop(1, '#022c22'); // Emerald-950
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 750, 1000);

    // 2. Draw soccer pitch lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;

    const margin = 50;
    const fWidth = 750 - 2 * margin;
    const fHeight = 1000 - 2 * margin;

    // Outer boundary
    ctx.strokeRect(margin, margin, fWidth, fHeight);

    // Midfield Line
    ctx.beginPath();
    ctx.moveTo(margin, 500);
    ctx.lineTo(750 - margin, 500);
    ctx.stroke();

    // Center Circle
    ctx.beginPath();
    ctx.arc(375, 500, 80, 0, 2 * Math.PI);
    ctx.stroke();

    // Center Spot
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(375, 500, 6, 0, 2 * Math.PI);
    ctx.fill();

    // Top Penalty Area (18-yard box)
    ctx.strokeRect(375 - 160, margin, 320, 130);
    // Bottom Penalty Area
    ctx.strokeRect(375 - 160, 1000 - margin - 130, 320, 130);

    // Top Goal Area (6-yard box)
    ctx.strokeRect(375 - 80, margin, 160, 45);
    // Bottom Goal Area
    ctx.strokeRect(375 - 80, 1000 - margin - 45, 160, 45);

    // Penalty spots
    ctx.beginPath();
    ctx.arc(375, margin + 95, 5, 0, 2 * Math.PI);
    ctx.arc(375, 1000 - margin - 95, 5, 0, 2 * Math.PI);
    ctx.fill();

    // Corner Arcs
    const cornerR = 20;
    // Top-Left
    ctx.beginPath();
    ctx.arc(margin, margin, cornerR, 0, 0.5 * Math.PI);
    ctx.stroke();
    // Top-Right
    ctx.beginPath();
    ctx.arc(750 - margin, margin, cornerR, 0.5 * Math.PI, Math.PI);
    ctx.stroke();
    // Bottom-Left
    ctx.beginPath();
    ctx.arc(margin, 1000 - margin, cornerR, 1.5 * Math.PI, 2 * Math.PI);
    ctx.stroke();
    // Bottom-Right
    ctx.beginPath();
    ctx.arc(750 - margin, 1000 - margin, cornerR, Math.PI, 1.5 * Math.PI);
    ctx.stroke();

    // 3. Draw Header Title
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.fillText('SƠ ĐỒ CHIẾN THUẬT PITCHHUB AI', 375, 36);

    // Match Details
    ctx.fillStyle = '#a7f3d0'; // emerald-200
    ctx.font = 'bold 15px Arial, sans-serif';

    let matchTitle = 'ĐỘI HÌNH TIÊU CHUẨN';
    let matchTime = '';
    const pitchPrefix = currentFormation.startsWith('11-') ? 'Sân 11' : currentFormation.startsWith('7-') ? 'Sân 7' : 'Sân 5';
    let matchPitch = `Sơ đồ: ${pitchPrefix} (${FORMATIONS[currentFormation]?.label || '7-2-3-1'})`;

    if (activeMatch !== 'default') {
      const booking = bookings.find((b) => b.id === activeMatch || String(b.id) === activeMatch);
      if (booking) {
        matchTitle = `TRẬN ĐẤU: ${booking.pitch?.namePitch?.toUpperCase() || 'SÂN BÓNG THỰC TẾ'}`;
        matchTime = dayjs(booking.startTime).format('HH:mm DD/MM/YYYY');
      }
    }

    ctx.fillText(matchTitle, 375, 975);
    if (matchTime) {
      ctx.fillText(`${matchTime}  |  ${matchPitch}`, 375, 950);
    } else {
      ctx.fillText(matchPitch, 375, 950);
    }

    // 4. Draw Players
    currentPositions.forEach((pos) => {
      const pctX = parseFloat(pos.left) / 100;
      const pctY = parseFloat(pos.top) / 100;

      const x = margin + pctX * fWidth;
      const y = margin + pctY * fHeight;

      const playerId = currentAssigns[pos.key];
      const player = roster.find((p) => p.id === playerId);

      if (player) {
        // Draw Shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;

        // Player Circle Jersey (Emerald Blue Theme)
        ctx.fillStyle = '#1e3a8a'; // Dark Blue Shirt
        ctx.beginPath();
        ctx.arc(x, y, 26, 0, 2 * Math.PI);
        ctx.fill();

        // Jersey ring borders
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.strokeStyle = '#f59e0b'; // Amber Gold Border
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 26, 0, 2 * Math.PI);
        ctx.stroke();

        // Jersey Number text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(player.number, x, y);

        // Player Name Tag Plate
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'; // Dark slate container
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;

        const boxW = 110;
        const boxH = 26;
        
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x - boxW / 2, y + 36, boxW, boxH, 4);
        } else {
          ctx.rect(x - boxW / 2, y + 36, boxW, boxH);
        }
        ctx.fill();
        ctx.stroke();

        // Player Name text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(player.name, x, y + 39);

        // Player position label
        ctx.fillStyle = '#f59e0b';
        ctx.font = '9px Arial, sans-serif';
        ctx.fillText(`${pos.key} - #${player.number}`, x, y + 51);

      } else {
        // Draw empty position dashed circle
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 26, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash

        // Draw position abbreviation
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.font = 'bold 12px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pos.key, x, y);
      }
    });

    // 5. Trigger download of file
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `PitchHub_Tactical_Board_${activeMatch === 'default' ? 'Default' : activeMatch}.png`;
    a.click();
    message.success('Đã xuất ảnh sơ đồ chiến thuật thành công! Bạn có thể gửi ảnh này vào nhóm Zalo để phổ biến.');
  };

  // --- Copy Text Share Action ---
  const handleCopyTextLineup = () => {
    let matchTitle = 'Đội hình Mặc định';
    let matchTime = '';
    let matchLocation = 'Chưa xác định';
    
    if (activeMatch !== 'default') {
      const booking = bookings.find((b) => b.id === activeMatch || String(b.id) === activeMatch);
      if (booking) {
        matchTitle = booking.pitch?.namePitch || 'Sân bóng';
        matchLocation = booking.pitch?.address || 'Tại chi nhánh PitchHub';
        matchTime = dayjs(booking.startTime).format('HH:mm DD/MM/YYYY');
      }
    }

    let text = `📋 SƠ ĐỒ CHIẾN THUẬT CHO TRẬN ĐẤU\n`;
    text += `🏟️ Sân: ${matchTitle}\n`;
    text += `📍 Địa chỉ: ${matchLocation}\n`;
    if (matchTime) {
      text += `⏰ Thời gian: ${matchTime}\n`;
    }
    const pitchPrefix = currentFormation.startsWith('11-') ? 'Sân 11' : currentFormation.startsWith('7-') ? 'Sân 7' : 'Sân 5';
    text += `⚽ Sơ đồ thi đấu: ${pitchPrefix} (${FORMATIONS[currentFormation]?.label || '7-2-3-1'})\n`;
    text += `────────────────────────\n\n`;

    const rolesMap = {
      GK: '🧤 THỦ MÔN (GK)',
      DF: '🛡️ HẬU VỆ (DF)',
      MF: '⚙️ TIỀN VỆ (MF)',
      FW: '🔥 TIỀN ĐẠO (FW)',
    };

    const grouped: { [key: string]: string[] } = { GK: [], DF: [], MF: [], FW: [] };

    currentPositions.forEach((pos) => {
      const playerId = currentAssigns[pos.key];
      const player = roster.find((p) => p.id === playerId);
      const line = player 
        ? `- #${player.number} ${player.name} (${pos.key})`
        : `- [Trống] (${pos.key})`;
      grouped[pos.role].push(line);
    });

    Object.keys(rolesMap).forEach((rKey) => {
      const roleLabel = rolesMap[rKey as keyof typeof rolesMap];
      const lines = grouped[rKey];
      if (lines.length > 0) {
        text += `${roleLabel}\n`;
        lines.forEach((l) => {
          text += `${l}\n`;
        });
        text += `\n`;
      }
    });

    // Bench / Substitutes
    const assignedIds = Object.values(currentAssigns).filter(Boolean) as string[];
    const benched = roster.filter((p) => !assignedIds.includes(p.id));
    
    if (benched.length > 0) {
      text += `🔄 DỰ BỊ / SẴN SÀNG (BENCH):\n`;
      benched.forEach((p) => {
        text += `- #${p.number} ${p.name} (${p.roles?.join(', ') || 'Chưa chọn'})\n`;
      });
      text += `\n`;
    }

    text += `────────────────────────\n`;
    text += `👉 Sơ đồ được thiết lập trên PitchHub. Chúc anh em thi đấu hết mình, giành thắng lợi! ⚽🔥`;

    navigator.clipboard.writeText(text).then(() => {
      message.success('Đã copy sơ đồ đội hình văn bản! Bạn có thể dán (Ctrl+V) trực tiếp vào ô chat Zalo.');
    }).catch(() => {
      message.error('Lỗi khi sao chép vào Clipboard');
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-emerald-800/20 pb-6">
        <div>
          <h2 className="font-h1 text-h1 text-emerald-900 flex items-center gap-2">
            Đội bóng & Sa bàn Chiến thuật
          </h2>
          <p className="text-gray-500 font-body-lg">
            Quản lý đội hình cầu thủ, thiết lập sơ đồ chiến thuật tương tác và xuất hình ảnh/tin nhắn chia sẻ Zalo nhanh chóng.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-semibold mb-1">CHỌN TRẬN ĐẤU</span>
            <Select
              className="w-64"
              value={activeMatch}
              onChange={(val) => setActiveMatch(val)}
              loading={bookingsLoading}
              options={[
                { value: 'default', label: 'Đội hình Mặc định' },
                ...bookings.map((b: any) => ({
                  value: String(b.id),
                  label: `${dayjs(b.startTime).format('DD/MM/YYYY')} - ${b.pitch?.namePitch || 'Sân bóng'}`
                }))
              ]}
            />
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-semibold mb-1">KIỂU SÂN</span>
            <Select
              className="w-36"
              value={activePitchType}
              onChange={handleSelectPitchType}
              options={[
                { value: '5', label: 'Sân 5 người' },
                { value: '7', label: 'Sân 7 người' },
                { value: '11', label: 'Sân 11 người' }
              ]}
            />
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-semibold mb-1">SƠ ĐỒ CHIẾN THUẬT</span>
            <Select
              className="w-48"
              value={currentFormation}
              onChange={handleSelectFormation}
              options={Object.keys(FORMATIONS)
                .filter((k) => k.startsWith(`${activePitchType}-`))
                .map((k) => ({
                  value: k,
                  label: FORMATIONS[k].label
                }))}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Side: Pitch Field Map (7/12) */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <Card 
            className="border-gray-200 shadow-sm overflow-hidden" 
            bodyStyle={{ padding: '1.5rem' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-h3 text-h3 text-emerald-900 flex items-center gap-2 m-0">
                Sa bàn Sân bóng
              </h3>
              <div className="flex items-center gap-2">
                <Button 
                  type="text" 
                  size="small" 
                  className="text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 flex items-center gap-1 font-semibold"
                  onClick={handleAutoFill}
                >
                  Tự động điền
                </Button>
                <Button 
                  type="text" 
                  danger 
                  size="small" 
                  className="flex items-center gap-1 font-semibold"
                  onClick={handleClearLineup}
                >
                  Xóa đội hình
                </Button>
              </div>
            </div>

            {/* Vertical Soccer Field */}
            <div className="relative w-full aspect-[3/4] max-w-[500px] mx-auto bg-gradient-to-b from-emerald-800 to-emerald-950 rounded-2xl border-4 border-emerald-900 shadow-lg overflow-hidden select-none">
              
              {/* Soccer Markings */}
              {/* Outer border padding line */}
              <div className="absolute inset-4 border border-white/20 pointer-events-none"></div>
              
              {/* Midfield Line */}
              <div className="absolute top-1/2 left-4 right-4 border-b border-white/20 pointer-events-none -translate-y-1/2"></div>
              
              {/* Center Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-white/20 rounded-full pointer-events-none"></div>
              
              {/* Center Spot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/40 rounded-full pointer-events-none"></div>

              {/* Top Penalty Area */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-16 border-b border-x border-white/20 pointer-events-none"></div>
              {/* Top Goal Area */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 border-b border-x border-white/20 pointer-events-none"></div>

              {/* Bottom Penalty Area */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-16 border-t border-x border-white/20 pointer-events-none"></div>
              {/* Bottom Goal Area */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-6 border-t border-x border-white/20 pointer-events-none"></div>

              {/* Player Positions */}
              {currentPositions.map((pos) => {
                const playerId = currentAssigns[pos.key];
                const player = roster.find((p) => p.id === playerId);
                
                // Content of selection Popover
                const popoverContent = (
                  <div className="w-56 max-h-72 overflow-y-auto space-y-2">
                    <div className="text-xs font-semibold text-gray-500 pb-1 border-b border-gray-100">
                      CHỌN CẦU THỦ CHO VỊ TRÍ {pos.key}
                    </div>
                    {player && (
                      <Button
                        type="dashed"
                        danger
                        block
                        size="small"
                        onClick={() => handleAssignPlayer(pos.key, null)}
                        className="flex items-center justify-center gap-1"
                      >
                        Gỡ cầu thủ
                      </Button>
                    )}
                    <div className="space-y-1 pt-1">
                      {roster.map((rPlayer) => {
                        // Check if player is assigned anywhere else
                        const assignedElsewhereKey = Object.keys(currentAssigns).find(
                          (k) => currentAssigns[k] === rPlayer.id && k !== pos.key
                        );
                        
                        return (
                          <div
                            key={rPlayer.id}
                            onClick={() => {
                              handleAssignPlayer(pos.key, rPlayer.id);
                            }}
                            className={`p-2 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                              playerId === rPlayer.id 
                                ? 'bg-emerald-50 border border-emerald-300' 
                                : 'hover:bg-gray-50 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center">
                                {rPlayer.number}
                              </span>
                              <div>
                                <span className="font-bold text-xs text-slate-800 block leading-tight">{rPlayer.name}</span>
                                <span className="text-[10px] text-gray-400">{rPlayer.roles?.join(', ')}</span>
                              </div>
                            </div>
                            {assignedElsewhereKey && (
                              <Tag color="orange" className="text-[9px] m-0">
                                {assignedElsewhereKey}
                              </Tag>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );

                return (
                  <Popover
                    key={pos.key}
                    content={popoverContent}
                    trigger="click"
                    placement="top"
                    overlayClassName="pitch-popover"
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: pos.top,
                        left: pos.left,
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer'
                      }}
                      className="group flex flex-col items-center z-10"
                    >
                      {player ? (
                        /* Assigned Active Player jersey button */
                        <div className="flex flex-col items-center">
                          <div className="relative w-12 h-12 rounded-full bg-blue-900 border-2 border-amber-400 flex items-center justify-center shadow-md text-white font-extrabold text-sm transition-transform group-hover:scale-110">
                            {player.number}
                            <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold">
                              ✓
                            </span>
                          </div>
                          <div className="mt-1.5 bg-slate-900/90 text-white border border-white/10 px-2 py-0.5 rounded text-[10px] font-extrabold leading-tight text-center shadow whitespace-nowrap min-w-[64px]">
                            {player.name}
                            <span className="block text-[8px] text-amber-400 font-bold">{pos.key}</span>
                          </div>
                        </div>
                      ) : (
                        /* Empty position button placeholder */
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full border-2 border-white/30 border-dashed bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/15 hover:border-white/60 transition-all font-bold text-lg">
                            +
                          </div>
                          <span className="mt-1 bg-black/40 text-white/70 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                            {pos.key}
                          </span>
                        </div>
                      )}
                    </div>
                  </Popover>
                );
              })}
            </div>

            {/* Sharing Controls Footer */}
            <div className="mt-6 border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Button
                type="primary"
                className="bg-emerald-700 hover:bg-emerald-800 border-none h-10 px-5 flex items-center justify-center gap-2 font-bold shadow"
                onClick={handleExportPNG}
              >
                Tải ảnh sơ đồ (PNG)
              </Button>
              <Button
                type="dashed"
                className="border-emerald-600 text-emerald-800 hover:text-emerald-900 hover:border-emerald-700 h-10 px-5 flex items-center justify-center gap-2 font-bold"
                onClick={handleCopyTextLineup}
              >
                Copy văn bản chia sẻ Zalo
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Side: Roster & Roster management (5/12) */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          {/* Squad Statistics Overview card */}
          <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-emerald-300 font-bold text-xs tracking-wider uppercase m-0">
              THỐNG KÊ CHIẾN THUẬT ĐỘI
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-3xl font-h1 block">
                  {roster.length}
                </span>
                <span className="text-emerald-400 text-xs font-semibold">Cầu thủ đăng ký</span>
              </div>
              <div>
                <span className="text-3xl font-h1 block">
                  {Object.values(currentAssigns).filter(Boolean).length} / {currentPositions.length}
                </span>
                <span className="text-emerald-400 text-xs font-semibold">Đã xếp lên sa bàn</span>
              </div>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${(Object.values(currentAssigns).filter(Boolean).length / currentPositions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Roster management card */}
          <Card 
            className="border-gray-200 shadow-sm"
            bodyStyle={{ padding: '1.5rem' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-h3 text-h3 text-emerald-900 flex items-center gap-2 m-0">
                Danh sách cầu thủ
              </h3>
              <Button
                type="primary"
                size="small"
                className="bg-emerald-800 hover:bg-emerald-700 border-none flex items-center gap-1 font-semibold"
                onClick={handleOpenAddPlayer}
              >
                Thêm cầu thủ
              </Button>
            </div>

            {/* List of squad roster players */}
            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto pr-1">
              {roster.length === 0 ? (
                <div className="py-8 text-center text-gray-400">
                  Chưa có cầu thủ nào. Bấm "Thêm cầu thủ" để bắt đầu!
                </div>
              ) : (
                roster.map((player) => {
                  const isAssigned = Object.values(currentAssigns).includes(player.id);
                  const assignedKey = isAssigned 
                    ? Object.keys(currentAssigns).find((key) => currentAssigns[key] === player.id) 
                    : null;

                  return (
                    <div key={player.id} className="py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors rounded-lg px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-extrabold text-sm shadow-sm">
                          {player.number}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-800 flex items-center gap-2 leading-tight">
                            {player.name}
                            {assignedKey && (
                              <Tag color="emerald" className="text-[10px] px-1 py-0 m-0 border-emerald-200">
                                Sân ({assignedKey})
                              </Tag>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 font-medium">Số áo: {player.number} • </span>
                          <Space size={4} className="inline-flex flex-wrap">
                            {player.roles?.map((r) => {
                              let roleColor = 'blue';
                              if (r === 'GK') roleColor = 'orange';
                              if (r === 'DF') roleColor = 'green';
                              if (r === 'FW') roleColor = 'red';
                              return (
                                <Tag key={r} color={roleColor} className="text-[9px] px-1 py-0 m-0 uppercase font-bold">
                                  {r}
                                </Tag>
                              );
                            })}
                          </Space>
                        </div>
                      </div>

                      <Space size="small">
                        <Button
                          type="link"
                          size="small"
                          className="text-emerald-700 hover:text-emerald-900 p-0"
                          onClick={() => handleOpenEditPlayer(player)}
                        >
                          Sửa
                        </Button>
                        <Button
                          type="link"
                          danger
                          size="small"
                          className="p-0"
                          onClick={() => handleDeletePlayer(player.id)}
                        >
                          Xóa
                        </Button>
                      </Space>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Roster Add/Edit Player Modal Dialog */}
      <Modal
        title={editingPlayer ? 'Cập nhật thông tin cầu thủ' : 'Thêm cầu thủ mới'}
        visible={isPlayerModalOpen}
        onOk={handleSavePlayer}
        onCancel={() => setIsPlayerModalOpen(false)}
        okText="Lưu lại"
        cancelText="Hủy"
        destroyOnClose
        okButtonProps={{ className: 'bg-emerald-800 hover:bg-emerald-700 border-none' }}
      >
        <Form
          form={playerForm}
          layout="vertical"
          initialValues={{ roles: ['MF'] }}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Họ và Tên cầu thủ"
            rules={[
              { required: true, message: 'Vui lòng điền tên cầu thủ' },
              { max: 20, message: 'Tên quá dài, tối đa 20 ký tự' }
            ]}
          >
            <Input placeholder="Ví dụ: Nguyễn Văn A" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="number"
              label="Số áo"
              rules={[
                { required: true, message: 'Vui lòng nhập số áo' },
                { pattern: /^[0-9]+$/, message: 'Số áo phải là chữ số' }
              ]}
            >
              <Input placeholder="Ví dụ: 10" maxLength={3} />
            </Form.Item>

            <Form.Item
              name="roles"
              label="Các vị trí sở trường"
              rules={[{ required: true, message: 'Vui lòng chọn ít nhất một vị trí sở trường' }]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn một hoặc nhiều vị trí sở trường"
                options={[
                  { value: 'GK', label: 'Thủ Môn (GK)' },
                  { value: 'DF', label: 'Hậu Vệ (DF)' },
                  { value: 'MF', label: 'Tiền Vệ (MF)' },
                  { value: 'FW', label: 'Tiền Đạo (FW)' }
                ]}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TeamManagement;
