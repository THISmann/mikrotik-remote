PGDMP     3    2                {            postgres    14.5    14.5 1    U           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            V           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            W           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            X           1262    14020    postgres    DATABASE     S   CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';
    DROP DATABASE postgres;
                postgres    false            Y           0    0    DATABASE postgres    COMMENT     N   COMMENT ON DATABASE postgres IS 'default administrative connection database';
                   postgres    false    3672            Z           0    0    SCHEMA public    ACL     e   REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres WITH GRANT OPTION;
                   postgres    false    5                        3079    16384 	   adminpack 	   EXTENSION     A   CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;
    DROP EXTENSION adminpack;
                   false            [           0    0    EXTENSION adminpack    COMMENT     M   COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';
                        false    2                        3079    123192    pldbgapi 	   EXTENSION     <   CREATE EXTENSION IF NOT EXISTS pldbgapi WITH SCHEMA public;
    DROP EXTENSION pldbgapi;
                   false            \           0    0    EXTENSION pldbgapi    COMMENT     Y   COMMENT ON EXTENSION pldbgapi IS 'server-side support for debugging PL/pgSQL functions';
                        false    3                       1255    57644 D   appendeventlog(bigint, character varying, time with time zone, text) 	   PROCEDURE     v  CREATE PROCEDURE public.appendeventlog(IN deviceid bigint, IN ip character varying, IN timestamps time with time zone, IN messages text)
    LANGUAGE plpgsql
    AS $$
begin
    -- remove a device 
	INSERT INTO public."eventLog"(
	"deviceId", ip, "timestamp", messages)
	VALUES (deviceID, ip , timestamps , messages) 
	RETURNING deviceId INTO deviceID;

    commit;
end;$$;
 �   DROP PROCEDURE public.appendeventlog(IN deviceid bigint, IN ip character varying, IN timestamps time with time zone, IN messages text);
       public          postgres    false                       1255    106837 V   createUpdateDevice(character varying, character varying, time without time zone, text)    FUNCTION     *  CREATE FUNCTION public."createUpdateDevice"(device_name character varying, ip character varying, "timestamp" time without time zone, data text) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
BEGIN
SELECT 1 FROM "devices" WHERE devices.id = id;

IF FOUND THEN

INSERT INTO "devices"
    (id, device_name, ip, "tagConfig", "userAction", "description")
    VALUES
        ($1, $1, $2, $1, $1 ,$1);
		
INSERT INTO "eventLog"
    (id, "device_name", "ip", "message" ,"timestamp")
    VALUES
        ($1, $2, $3, $4, $5);

UPDATE "USERS" 
    SET     "name" = $2,
    "lastName" = $3,
    "userName" = $4,
    "password" = $5,
    "eMail" = $6
WHERE "userID" = $1;
ELSE
    INSERT INTO "eventLog"
    (id, "device_name", "ip", "message", "timestamp")
    VALUES ($1, $2, $3, $4 ,$5);
END IF;
RETURN TRUE;
END;
$_$;
 �   DROP FUNCTION public."createUpdateDevice"(device_name character varying, ip character varying, "timestamp" time without time zone, data text);
       public          postgres    false                       1255    49532 O   createUpdateDevice_old(bigint, character varying, time without time zone, text)    FUNCTION     	  CREATE FUNCTION public."createUpdateDevice_old"(p_imei bigint, ip character varying, "timestamp" time without time zone, data text) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
BEGIN
SELECT 1 FROM "devices" WHERE devices.imei = p_imei;

IF FOUND THEN

INSERT INTO "devices"
    ("imei", "name", "ip", "tagConfig", "userAction", "description")
    VALUES
        ($1, $1, $2, $1, $1 ,$1);
		
INSERT INTO "eventLog"
    ("imei", "ip", "timestamp", "messages")
    VALUES
        ($1, $2, $3, $4);

UPDATE "USERS" 
    SET     "name" = $2,
    "lastName" = $3,
    "userName" = $4,
    "password" = $5,
    "eMail" = $6
WHERE "userID" = $1;
ELSE
    INSERT INTO "eventLog"
    ("imei", "ip", "timestamp", "messages")
    VALUES ($1, $2, $3, $4);
END IF;
RETURN TRUE;
END;
$_$;
 �   DROP FUNCTION public."createUpdateDevice_old"(p_imei bigint, ip character varying, "timestamp" time without time zone, data text);
       public          postgres    false            �            1259    49395 
   device_old    TABLE     �   CREATE TABLE public.device_old (
    imei bigint NOT NULL,
    name character varying(100) NOT NULL,
    ip character varying(150) NOT NULL,
    "tagConfig" text NOT NULL,
    "userAction" text NOT NULL,
    description text
);
    DROP TABLE public.device_old;
       public         heap    postgres    false            �            1255    49527    getdevice(bigint)    FUNCTION     �   CREATE FUNCTION public.getdevice(imei bigint) RETURNS SETOF public.device_old
    LANGUAGE sql
    AS $_$
    SELECT * FROM "devices" WHERE imei = $1;
$_$;
 -   DROP FUNCTION public.getdevice(imei bigint);
       public          postgres    false    212            �            1255    49444    getdevicelist()    FUNCTION     �   CREATE FUNCTION public.getdevicelist() RETURNS SETOF public.device_old
    LANGUAGE sql
    AS $$
    SELECT * FROM "devices";
$$;
 &   DROP FUNCTION public.getdevicelist();
       public          postgres    false    212            �            1255    49509    geteventlog(bigint) 	   PROCEDURE       CREATE PROCEDURE public.geteventlog(IN deviceid bigint)
    LANGUAGE plpgsql
    AS $$
begin
    -- select event log with deviceId
	SELECT "deviceId", ip, "timestamp", messages
	FROM public."eventLog" WHERE "deviceId" = deviceID
    INTO deviceID;

    commit;
end;$$;
 7   DROP PROCEDURE public.geteventlog(IN deviceid bigint);
       public          postgres    false            �            1255    49510 ,   gettimeseriesdata(bigint, character varying) 	   PROCEDURE       CREATE PROCEDURE public.gettimeseriesdata(IN deviceid bigint, IN tagname character varying)
    LANGUAGE plpgsql
    AS $$
begin
    -- remove a device 
    SELECT * FROM "TimeSeriesData" WHERE "deviceId" = deviceID and "tagName" = tagname;

    commit;
end;$$;
 [   DROP PROCEDURE public.gettimeseriesdata(IN deviceid bigint, IN tagname character varying);
       public          postgres    false            
           1255    106875 f   logmessage(character varying, character varying, character varying, timestamp without time zone, text)    FUNCTION       CREATE FUNCTION public.logmessage(p_id character varying, p_device_name character varying, p_ip character varying, p_timestamp timestamp without time zone, p_message text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
	_id character varying;
	_device_name character varying;
	_ip character varying;
	_tag_config text;
BEGIN
	-- Check if device already exists in device table
	SELECT 1 "id", "device_name", "ip", "tag_config" INTO _id, _device_name, _ip, _tag_config FROM "devices" WHERE devices.id = p_id;
	IF _id ISNULL THEN
		-- device does not exist, create new entry in device table
		INSERT INTO "devices"
				("id","device_name", "ip", "tag_config", "user_action", "description")
			VALUES
				(p_id, p_device_name, p_ip, '', '', '');
	ELSE
		UPDATE "devices" SET ip = p_ip WHERE id = p_id;
	END IF;
	
	-- Insert message into the event log
	INSERT INTO "eventLog"
			("id", "device_name", "ip", "timestamp", "message")
		VALUES
			(p_id, p_device_name, p_ip, p_timestamp, p_message);
	RETURN _tag_config;
END;
$$;
 �   DROP FUNCTION public.logmessage(p_id character varying, p_device_name character varying, p_ip character varying, p_timestamp timestamp without time zone, p_message text);
       public          postgres    false                       1255    65834 L   logmessage_old(bigint, character varying, timestamp without time zone, text)    FUNCTION     r  CREATE FUNCTION public.logmessage_old(p_imei bigint, p_ip character varying, p_timestamp timestamp without time zone, p_message text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
	_imei bigint;
	_ip character varying;
	_tagConfig text;
BEGIN
	-- Check if device already exists in device table
	SELECT 1 imei, ip, "tagConfig" INTO _imei, _ip, _tagConfig FROM "device" WHERE device.imei = p_imei;
	IF _imei ISNULL THEN
		-- device does not exist, create new entry in device table
		INSERT INTO "device"
				("imei", "name", "ip", "tagConfig", "userAction", "description")
			VALUES
				(p_imei, p_imei, p_ip, '', '', '');
	ELSE
		UPDATE "device" SET ip = p_ip WHERE imei = p_imei;
	END IF;
	
	-- Insert message into the event log
	INSERT INTO "eventLog"
			("imei", "ip", "timestamp", "message")
		VALUES
			(p_imei, p_ip, p_timestamp, p_message);
	RETURN _tagConfig;
END;
$$;
 �   DROP FUNCTION public.logmessage_old(p_imei bigint, p_ip character varying, p_timestamp timestamp without time zone, p_message text);
       public          postgres    false            	           1255    106838 X   logmessage_old2(character varying, character varying, timestamp without time zone, text)    FUNCTION     �  CREATE FUNCTION public.logmessage_old2(p_device_name character varying, p_ip character varying, p_timestamp timestamp without time zone, p_message text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
	_device_name character varying;
	_ip character varying;
	_tagConfig text;
BEGIN
	-- Check if device already exists in device table
	SELECT 1 device_name, ip, "tagConfig" INTO _device_name, _ip, _tagConfig FROM "device" WHERE device.device_name = p_device_name;
	IF _device_name ISNULL THEN
		-- device does not exist, create new entry in device table
		INSERT INTO "device"
				("device_name", "ip", "tagConfig", "userAction", "description")
			VALUES
				(p_device_name, p_ip, '', '', '');
	ELSE
		UPDATE "device" SET ip = p_ip WHERE device_name = p_device_name;
	END IF;
	
	-- Insert message into the event log
	INSERT INTO "eventLog"
			("device_name", "ip", "timestamp", "message")
		VALUES
			(p_device_name, p_ip, p_timestamp, p_message);
	RETURN _tagConfig;
END;
$$;
 �   DROP FUNCTION public.logmessage_old2(p_device_name character varying, p_ip character varying, p_timestamp timestamp without time zone, p_message text);
       public          postgres    false                        1255    49511    removeDevice(bigint) 	   PROCEDURE     �   CREATE PROCEDURE public."removeDevice"(IN deleteid bigint)
    LANGUAGE plpgsql
    AS $$
begin
    -- remove a device 
    DELETE FROM devices WHERE id = deleteid;

    commit;
end;$$;
 :   DROP PROCEDURE public."removeDevice"(IN deleteid bigint);
       public          postgres    false            �            1259    131394    SequelizeMeta    TABLE     R   CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);
 #   DROP TABLE public."SequelizeMeta";
       public         heap    postgres    false            �            1259    131410    Users    TABLE     z  CREATE TABLE public."Users" (
    id integer NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    email character varying(255),
    password character varying(255),
    location character varying(255),
    phone character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Users";
       public         heap    postgres    false            �            1259    131409    Users_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Users_id_seq";
       public          postgres    false    223            ]           0    0    Users_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;
          public          postgres    false    222            �            1259    106853    devices    TABLE     O  CREATE TABLE public.devices (
    id character varying(100) NOT NULL,
    device_name character varying(100),
    ip character varying(100),
    tag_config text,
    user_action text,
    description text,
    technician character varying(100),
    device_username character varying(100),
    device_password character varying(100)
);
    DROP TABLE public.devices;
       public         heap    postgres    false            �            1259    49394    devices_id_seq    SEQUENCE     �   ALTER TABLE public.device_old ALTER COLUMN imei ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.devices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    212            �            1259    115000    eventLog    TABLE     �   CREATE TABLE public."eventLog" (
    id character varying(100) NOT NULL,
    ip character varying(100),
    message text,
    "timestamp" timestamp without time zone,
    device_name character varying(100)
);
    DROP TABLE public."eventLog";
       public         heap    postgres    false            �            1259    106865    timeSeriesData    TABLE     �   CREATE TABLE public."timeSeriesData" (
    id character varying(100) NOT NULL,
    device_name character varying(100),
    tag_name character varying(100),
    value double precision,
    "timestamp" timestamp without time zone
);
 $   DROP TABLE public."timeSeriesData";
       public         heap    postgres    false            �           2604    131413    Users id    DEFAULT     h   ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);
 9   ALTER TABLE public."Users" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    223    223            P          0    131394    SequelizeMeta 
   TABLE DATA           /   COPY public."SequelizeMeta" (name) FROM stdin;
    public          postgres    false    221   �L       R          0    131410    Users 
   TABLE DATA           x   COPY public."Users" (id, first_name, last_name, email, password, location, phone, "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    223   ?M       L          0    49395 
   device_old 
   TABLE DATA           \   COPY public.device_old (imei, name, ip, "tagConfig", "userAction", description) FROM stdin;
    public          postgres    false    212   `P       M          0    106853    devices 
   TABLE DATA           �   COPY public.devices (id, device_name, ip, tag_config, user_action, description, technician, device_username, device_password) FROM stdin;
    public          postgres    false    213   }P       O          0    115000    eventLog 
   TABLE DATA           O   COPY public."eventLog" (id, ip, message, "timestamp", device_name) FROM stdin;
    public          postgres    false    215   YX       N          0    106865    timeSeriesData 
   TABLE DATA           Y   COPY public."timeSeriesData" (id, device_name, tag_name, value, "timestamp") FROM stdin;
    public          postgres    false    214   Z       ^           0    0    Users_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Users_id_seq"', 30, true);
          public          postgres    false    222            _           0    0    devices_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.devices_id_seq', 2, true);
          public          postgres    false    211            �           2606    131398     SequelizeMeta SequelizeMeta_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);
 N   ALTER TABLE ONLY public."SequelizeMeta" DROP CONSTRAINT "SequelizeMeta_pkey";
       public            postgres    false    221            �           2606    131417    Users Users_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_pkey";
       public            postgres    false    223            �           2606    106859    devices device_pkey1 
   CONSTRAINT     R   ALTER TABLE ONLY public.devices
    ADD CONSTRAINT device_pkey1 PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.devices DROP CONSTRAINT device_pkey1;
       public            postgres    false    213            �           2606    49459    device_old devices_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.device_old
    ADD CONSTRAINT devices_pkey PRIMARY KEY (imei);
 A   ALTER TABLE ONLY public.device_old DROP CONSTRAINT devices_pkey;
       public            postgres    false    212            �           2606    115005    eventLog eventLog_id_fkey    FK CONSTRAINT     y   ALTER TABLE ONLY public."eventLog"
    ADD CONSTRAINT "eventLog_id_fkey" FOREIGN KEY (id) REFERENCES public.devices(id);
 G   ALTER TABLE ONLY public."eventLog" DROP CONSTRAINT "eventLog_id_fkey";
       public          postgres    false    215    213    3513            �           2606    106870 &   timeSeriesData timeSeriesData _id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."timeSeriesData"
    ADD CONSTRAINT "timeSeriesData _id_fkey" FOREIGN KEY (id) REFERENCES public.devices(id);
 T   ALTER TABLE ONLY public."timeSeriesData" DROP CONSTRAINT "timeSeriesData _id_fkey";
       public          postgres    false    213    214    3513            5           826    139577     DEFAULT PRIVILEGES FOR SEQUENCES    DEFAULT ACL     s   ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres WITH GRANT OPTION;
          public          postgres    false            7           826    139579    DEFAULT PRIVILEGES FOR TYPES    DEFAULT ACL     o   ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TYPES  TO postgres WITH GRANT OPTION;
          public          postgres    false            6           826    139578     DEFAULT PRIVILEGES FOR FUNCTIONS    DEFAULT ACL     s   ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres WITH GRANT OPTION;
          public          postgres    false            4           826    139576    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     p   ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO postgres WITH GRANT OPTION;
          public          postgres    false            P   2   x�32026062042016�M.JM,I�--N-��*�2�˚b���qqq 3�_      R     x���[o�@�k�{ѻM�90�xUO�XQDJz���
����~���jk��l�fL�7�y�p�A�̱}nO9'r�w���g��!�8�	������{H�1���%* ?!���_����������^��$�	'cB���3�E���9�<GO/�s�w�)s�ĢV����I�<7 ��e�k��){^�K9����m�������K�	D>�N#�e���o;�x�MuEh�Ӈʸ��Ugj�k?����LX'7��-�(�� Fs�%Ͷ/�ׄT��/�{�K��!Wt�-C�a�)'w��Œ﷚O=eo�����\ k�uD��|���e��* ��3���G0S��5O:��7x�זV���®_����+/�Zuj�9,���f����R�6�'�r��Oi���#N#�Ly�Z�i�#����cў�q�7\����*�� )��U��Ei��n�m?k��V�ٔ]�aX�`rf�G<�y����7�7�zQ(�F�j��c�j^�)R�e�Z33n���j>��f�W�-U��8�����$O?�N#�㺽^?L�`l���c/��v%Q �"
K<& %�Z��-ˢ�v^�{J)�����ƴJ$�9�q�#�s7is�`ଣ������Lp�캡�@e����X�2��&��u{�Ɯv���-;vR\n�:(s�p����~ \�� 
���S�#���}�;���ѯu��l��u�M�Yt�:|�:!K����p�bz�:rӺL��U]�'�U]��dz�]�]�'ٵ~�x��	ۙ�      L      x������ � �      M   �  x��[�r7}����gY��qӛ�8�C��J�[[[�R5�5��%�r����m��,�����ȴx838h }�_\�R�~�j�"ΫD���S�܉��g4�K����NJ5��t�̧����]��բ���iҼ�钿8��!���68:m�K:�j1���z���%��Ek�P s�����?V�:�yuዪ�/����P=�?�u���xxW�e�!��RQكK"��"��ۺ��C���ii��=Α��U��r���cj�RSM'j�����װ������w�C��^�n�G��\�띚o$�?*���7�μ���6�<#�(L
�#�샲DF�I���K>�¾������n�Y]�|t*�<-Ҽ������9��a>I�q����jtÏ�#{�����?�[�_h��\iӬ|�ېs���9I��'�ZABB*�����ۭ�x�o���U�Ӣ�q�m�U��a�MS�"`�Z;g!HQ�LPS�^�a����ڤz3PS�dBò��p<���0p�._\]�|����;�$1'|4J�-�{�R,(mJt�Z/�١=���\
���E[WR �cE���l��Ķ��#�h�5���z�igH}�{h!�,�|@���|
Q!BV�)�IB�^�!~0&Z��I'����uV��sY��"b���>K�?Q�XmJBDB�BBB�cb��F�]���w�>����t�l��s.�����5?�띑����jy�*k��Fxm\�
J�蓌<���\�^������.�6�w��a]-/��n���o֯��h:��uU׃ذ�Qf �:�֟ȃS2�"g��2�U)��(@�ELN�)�^̳���C��i���`��5c>������J[��췃|�.I�$=�M*�C�Ε��k��!�횔{�{���r{V��$�V;S�g��:�b��H�$iAh���C4<1���݋�B��#�9���V�o��s���j<���w�+��tzo��kO����c9����.��gcF��(�s��Rf���1��D���Z5�?�~�w����b������h��M (�t}**��ŀ�t���=���g�s�kq��ξ�R��a��(�%A`��ݸK��P���#x�>�f��0��BGp2`J`J�`�T�3x����c��9��MuI�Ns#g�����L���j�~9�Vk�زb}�Υ���4H�䣒d2Y��lO���f/f?�Μÿ��M��<|���y�(9��Y�%���Υ�>�Y�m!nBҔ�0h��^�7�J�Bt��x/��?u`0�~(b�P|�"#Y�R	�v��4�Aˎ�,Q�j: c�^:�Ҧ%r玄>�����*�Pd"��ֈP�S��:'�n����\���>E� �m���ϧ,�"�5��4�j��t�u�nr9fF,eG)�2}7��r2�x��:Á�����Ĭ�g�k3�\")5� s�f���G3q����^)��
x�V�χ�PXe�Zr�ҹ	��4�څ��P�i��K(Bi-�>A�N�ԇ}N�N<+A�pG#ϓ��*����b�CD�B�-"�^��7**X�	�#KZ���	�� 
(�w�{�{����ԡ�;����DMxE��.V~���[������j�����	�'�������E��$� {yv�19�y���콘�h�۽�-��5��t�j-�^(�!{B/�P(V˖:i��6v�,�a��P����f�P�l?A5D"� l,�IA[,Rp�*���L��gհo��QD��(�x0��-�M��t���T�n�.U����d��?�	)�:��9��iݻ��A��H�!���F�9d�W葇/�r�sK/v�2�'jn�q[G�4ov�pj������m=�D�\{
>�C��6�(�u�ye�^��i_ќ��yn�~������M��Ľʢ��/��Be)��қ.��/�s�U;�M��#�٬��^������� ���[      O   �  x���M��@���+�{A��a��J��K{誷H���R��&,���kh�TjE�d���}^��g6��~\F"�:��KQ/����m�=�������z7ԭ�/�#�T$X&d�� 	�)�%[�>Ǜ (��U��w���z����ǳ�Mm��<yx�C�'���X,K�/4M/���da+Y9�cB�o�W������������u���3�=?���j��mo�ȀV��zY<��=��J�'��
�C3w���8�dA�<����@ˋ���œo���d&�\�D��E��u���J�{�?�iK�Yn���^'[,��vd�Pp9'���E�ګ6�:G�$�Ю:���� �Q�s1N����W��Kp5y�n9n�\:r����hZ�q^i}H3���7� L픘�Ry9='�Ǽ�(B��iAs�3.�kNsM.h��U��o.O�,      N   �   x���A
�0�u��@df��:;��	
%��Tl�f��u!v!��7~��!�*}��Ms�7��q�E*F��q��X�+B��g�<���>�V-k���xF���H��U����t�M(�B����� C����W�     