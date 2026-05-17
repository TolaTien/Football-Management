import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Tag, Typography } from 'antd';
import { pitchApi } from '@/shared/api/modules';
import type { Pitch } from '@/shared/types/domain';

const PitchesPage: React.FC = () => {
  const [pitches, setPitches] = useState<Pitch[]>([]);

  useEffect(() => {
    void pitchApi.list().then((res) => setPitches(res.data.data));
  }, []);

  return (
    <>
      <Typography.Title level={2}>Danh sách sân</Typography.Title>
      <Row gutter={[16, 16]}>
        {pitches.map((pitch) => (
          <Col span={8} key={pitch.pitchId}>
            <Card title={pitch.namePitch}>
              <p>Địa chỉ: {pitch.address || '-'}</p>
              <p>Loại sân: {pitch.pitchCategory || '-'}</p>
              <Tag color={pitch.status === 'active' ? 'green' : 'orange'}>{pitch.status}</Tag>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default PitchesPage;
