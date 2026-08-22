# ─── Zone DNS wafizo.fr ───────────────────────────────────────────────────────

resource "ovh_domain_zone_record" "wafizo_fr_root" {
  zone      = var.domain_wafizo_fr
  fieldtype = "A"
  subdomain = ""
  ttl       = 300
  target    = openstack_compute_instance_v2.wafizo.access_ip_v4
}

resource "ovh_domain_zone_record" "wafizo_fr_www" {
  zone      = var.domain_wafizo_fr
  fieldtype = "A"
  subdomain = "www"
  ttl       = 300
  target    = openstack_compute_instance_v2.wafizo.access_ip_v4
}

resource "ovh_domain_zone_record" "wafizo_fr_app" {
  zone      = var.domain_wafizo_fr
  fieldtype = "A"
  subdomain = "app"
  ttl       = 300
  target    = openstack_compute_instance_v2.wafizo.access_ip_v4
}

resource "ovh_domain_zone_record" "wafizo_fr_api" {
  zone      = var.domain_wafizo_fr
  fieldtype = "A"
  subdomain = "api"
  ttl       = 300
  target    = openstack_compute_instance_v2.wafizo.access_ip_v4
}

# ─── Zone DNS wafizo.com ──────────────────────────────────────────────────────

resource "ovh_domain_zone_record" "wafizo_com_root" {
  zone      = var.domain_wafizo_com
  fieldtype = "A"
  subdomain = ""
  ttl       = 300
  target    = openstack_compute_instance_v2.wafizo.access_ip_v4
}

resource "ovh_domain_zone_record" "wafizo_com_www" {
  zone      = var.domain_wafizo_com
  fieldtype = "A"
  subdomain = "www"
  ttl       = 300
  target    = openstack_compute_instance_v2.wafizo.access_ip_v4
}
