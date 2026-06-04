import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Skeleton } from 'antd';
import { PlusOutlined, MessageOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/app/store/hooks';
import {
    selectConversations, selectLoadingConversations,
    fetchConversations, createConversation, fetchMessages, setActiveConversation,
} from '@/entities/ai';


const ConversationList: React.FC = () => {
    const dispatch = useAppDispatch();
    const conversations = useSelector(selectConversations);
    const loading = useSelector(selectLoadingConversations);

    useEffect(() => {
        dispatch(fetchConversations());
    }, [dispatch]);

    const handleSelect = (conversationId: string) => {
        dispatch(setActiveConversation(conversationId));
        dispatch(fetchMessages(conversationId));
    };

    const handleNew = async () => {
        const result = await dispatch(createConversation(undefined));
        if (createConversation.fulfilled.match(result)) {
            const newId = result.payload.conversationId;
            dispatch(fetchMessages(newId));
        }
    };

    const formatTime = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins} phút trước`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours} giờ trước`;
        return `${Math.floor(hours / 24)} ngày trước`;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px' }}>
                <Button
                    block
                    icon={<PlusOutlined />}
                    onClick={handleNew}
                    style={{
                        background: '#059669', color: 'white',
                        borderColor: '#059669', borderRadius: 10,
                    }}
                >
                    Cuộc trò chuyện mới
                </Button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 8px' }}>
                {loading && [1, 2, 3].map((i) => (
                    <div key={i} style={{ padding: '8px 12px' }}>
                        <Skeleton active paragraph={{ rows: 1 }} />
                    </div>
                ))}
                {!loading && conversations.map((conv) => (
                    <div
                        key={conv.conversationId}
                        onClick={() => handleSelect(conv.conversationId)}
                        style={{
                            padding: '10px 12px',
                            borderRadius: 10,
                            cursor: 'pointer',
                            marginBottom: 4,
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f0fdf4')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <MessageOutlined style={{ color: '#059669', flexShrink: 0 }} />
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <p style={{
                                    margin: 0, fontSize: 13, fontWeight: 500,
                                    color: '#111827', overflow: 'hidden',
                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>
                                    {conv.title}
                                </p>
                                <p style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>
                                    {formatTime(conv.updatedAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                {!loading && conversations.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: 13, marginTop: 24 }}>
                        Chưa có cuộc trò chuyện nào
                    </p>
                )}
            </div>
        </div>
    );
};

export default ConversationList;
